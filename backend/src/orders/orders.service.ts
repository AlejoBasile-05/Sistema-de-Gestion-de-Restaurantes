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

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {

    const productIds = createOrderDto.orderItems.map(item => item.productId);
    const productWithIngredients = await this.productRepository.find({ where: { id: In(productIds) }, relations: {
        productIngredients: { ingredient: true }} });

    if (productWithIngredients.length !== new Set(productIds).size) { // new Set() elimina duplicados de un array
      throw new NotFoundException('Alguno de los productos no existe');
    }

    let total = 0;
    const orderItemsEntities: OrderItem[] = [];
    
    // Utilizo transaction para asegurar la integridad de los datos
    const result = await this.dataSource.transaction(async (manager) => {

      for (const item of createOrderDto.orderItems) {
        const product = productWithIngredients.find(p => p.id === item.productId);

        for (const pi of product?.productIngredients || []) {
          if (pi.ingredient.stock < item.quantity * pi.quantity) {
            throw new NotFoundException(`No hay suficiente stock del ingrediente: ${pi.ingredient.name}`);
          }
          pi.ingredient.stock -= item.quantity * pi.quantity;
          await manager.getRepository(Ingredient).save(pi.ingredient);
        }

        total += Number(product?.price) * item.quantity;

        // Creo la orden con .manager de TypeORM ya que OrderItem no es inyectable directamente
        const orderItemEntity = manager.getRepository(OrderItem).create({
          product: product,
          quantity: item.quantity,
          price: product?.price,
        });
        orderItemsEntities.push(orderItemEntity);
      }

      return manager.getRepository(Order).save({
        tableId: createOrderDto.tableId,
        total,
        orderItems: orderItemsEntities,
      });
    })

    return result;
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
    const order = await this.orderRepository.findOne({where: {id}});
    if (!order) {
      throw new NotFoundException(`La orden con id ${id} no existe`);
    }
    order.status = updateOrderDto.status;
    return this.orderRepository.save(order);
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

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
