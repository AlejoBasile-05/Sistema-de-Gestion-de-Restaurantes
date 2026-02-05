import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm'; 
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IngredientsService {

  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    const ingredientToSave = this.ingredientRepository.create(createIngredientDto);
    return await this.ingredientRepository.save(ingredientToSave);
  }

  async findAll() {
    return await this.ingredientRepository.find();
  }

  async findOne(id: number) {
    return await this.ingredientRepository.findOneBy({ id });
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return await this.ingredientRepository.update(id, updateIngredientDto);
  }

  async remove(id: number) {
    return await this.ingredientRepository.delete(id);
  }
}
