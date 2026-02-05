import { Injectable } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovementType, StockMovement } from './entities/stock-movement.entity';
import { Repository } from 'typeorm';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>
  ) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    const ingredient = await this.ingredientRepository.findOneBy({ id: createStockMovementDto.ingredientId });
    if (!ingredient) {
      throw new Error('Ingredient not found');
    }

    if (createStockMovementDto.type === MovementType.OUT) {
      if (ingredient.stock < createStockMovementDto.quantity) {
        throw new Error('Stock Insuficiente');
      }
      ingredient.stock = Number(ingredient.stock) - Number(createStockMovementDto.quantity);
      await this.ingredientRepository.save(ingredient);
    } else if (createStockMovementDto.type === MovementType.IN) {
      ingredient.stock = Number(ingredient.stock) + Number(createStockMovementDto.quantity);
      await this.ingredientRepository.save(ingredient);
    }

    const stockMovementSave = this.stockMovementRepository.create({...createStockMovementDto, ingredient});
    return await this.stockMovementRepository.save(stockMovementSave);
  }

  findAll() {
    return `This action returns all stockMovements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockMovement`;
  }

  update(id: number, updateStockMovementDto: UpdateStockMovementDto) {
    return `This action updates a #${id} stockMovement`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockMovement`;
  }
}
