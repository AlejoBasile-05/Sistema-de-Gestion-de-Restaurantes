import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { In } from 'typeorm/find-options/operator/In';
import { OrderItem } from './entities/order-item.entity';
import { DataSource } from 'typeorm/data-source/DataSource';
import { MovementType, StockMovement } from 'src/stock-movements/entities/stock-movement.entity';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial } from 'typeorm';
import { BadRequestException } from '@nestjs/common/exceptions';
import { BillDto } from './dto/bill.dto';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(StockMovement) private readonly stockMovementRepository: Repository<StockMovement>,
  ) {}


  async create(createOrderDto: CreateOrderDto, user: User) {
    return await this.dataSource.transaction(async (manager) => {
      
      const productIds = createOrderDto.orderItems.map(item => item.productId);
      
      const productWithIngredients = await manager.getRepository(Product).find({
        where: { id: In(productIds) },
        relations: { productIngredients: { ingredient: true } }
      });

      if (productWithIngredients.length !== new Set(productIds).size) {
        throw new NotFoundException('Alguno de los productos no existe');
      }

      let total = 0;

      const stockMovementsValues: any[] = [];
      const orderItemsValues: any[] = [];

      const ingredientsToUpdate = new Map<number, number>();

      for (const item of createOrderDto.orderItems) {
        const product = productWithIngredients.find(p => p.id === item.productId);
        if (!product) continue;

        for (const pi of product.productIngredients) {
          const currentStock = Number(pi.ingredient.stock);
          const quantityNeeded = Number(item.quantity) * Number(pi.quantity);

          if (currentStock < quantityNeeded) {
            throw new NotFoundException(`No hay suficiente stock del ingrediente: ${pi.ingredient.name}`);
          }

          const newStock = currentStock - quantityNeeded;

          ingredientsToUpdate.set(pi.ingredient.id, newStock);

          stockMovementsValues.push({
            quantity: quantityNeeded,
            type: MovementType.OUT,
            description: `Uso en orden de mesa ${createOrderDto.tableId}`,
            ingredient: { id: pi.ingredient.id },
          });
        }

        total += Number(product.price) * item.quantity;

        orderItemsValues.push({
          quantity: item.quantity,
          price: Number(product.price),
          product: { id: product.id }, 
        });
      }

      for (const [id, stock] of ingredientsToUpdate) {
        await manager.createQueryBuilder()
          .update(Ingredient)
          .set({ stock: stock })
          .where("id = :id", { id })
          .execute();
      }

      if (stockMovementsValues.length > 0) {
        await manager.createQueryBuilder()
          .insert()
          .into(StockMovement)
          .values(stockMovementsValues)
          .execute();
      }

      const insertOrderResult = await manager.createQueryBuilder()
        .insert()
        .into(Order)
        .values({
          tableId: createOrderDto.tableId,
          total: total,
          status: OrderStatus.PENDIENTE,
          user: { id: user.id }, 
        })
        .execute();

      const orderId = insertOrderResult.identifiers[0].id;

      const finalOrderItems = orderItemsValues.map(val => ({
        ...val,
        order: { id: orderId }
      }));

      await manager.createQueryBuilder()
        .insert()
        .into(OrderItem)
        .values(finalOrderItems)
        .execute();

      return {
        id: orderId,
        tableId: createOrderDto.tableId,
        total,
        status: OrderStatus.PENDIENTE,
        user: user,
        orderItems: finalOrderItems
      };
    });
  }

  async findAll(status : OrderStatus) {
      return this.orderRepository.find({
        where: status ? { status } : {},
        relations: {
          orderItems: {
            product: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });
    }

  async findForTable(tableId: number) {
    const orders = await this.orderRepository.find({
      where: { tableId: tableId, status: In([OrderStatus.ENTREGADO, OrderStatus.LISTO, OrderStatus.PENDIENTE]) },
      relations: {
        orderItems: {
          product: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const total =  orders.reduce((acc, order) => acc + Number(order.total), 0);

    const result : BillDto = {
      tableId,
      orderItems: orders.flatMap(order => order.orderItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
      }))),
      totalAmount: total,
      createdAt: new Date(),
    };

    return result
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        orderItems: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`La orden con id ${id} no existe`);
    }

    return order;
  }

  async updateStatus(id: number, updateOrderDto: UpdateOrderDto) {

    return await this.dataSource.transaction(async (manager) => {

      const order = await manager.findOne(Order, {
        where: { id },
        relations: {
          orderItems: {
            product: {
              productIngredients: {
                ingredient: true
              }
            }
          }
        }
      });

      if (!order) {
        throw new NotFoundException(`La orden con id ${id} no existe`);
      }

      if (order.status === OrderStatus.CANCELADO) {
        throw new BadRequestException('No se puede modificar una orden que ya fue cancelada');
      }

      if (updateOrderDto.status === OrderStatus.CANCELADO) {

        for (const item of order.orderItems) {

          for (const pi of item.product.productIngredients) {

            const quantityToReturn = Number(item.quantity) * Number(pi.quantity);

            await manager.increment(Ingredient, { id: pi.ingredient.id }, 'stock', quantityToReturn);

            await manager.insert(StockMovement, {
              quantity: quantityToReturn,
              type: MovementType.IN, 
              description: `Devolución por cancelación de orden #${order.id} (Mesa ${order.tableId})`,
              ingredient: { id: pi.ingredient.id },
            });
          }
        }
      }

      order.status = updateOrderDto.status;

      return await manager.save(Order, order);
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({
      id: id,
      ...updateOrderDto,
    });
    if (!order) {
      throw new NotFoundException(`La orden con id ${id} no existe`);
    }
    return this.orderRepository.save(order);
  }

  async remove(id: number) {

    return await this.orderRepository.delete(id);
  }
}
