import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { Product } from './entities/product.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { ProductIngredient } from './entities/product-ingredient.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) 
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductIngredient)
    private readonly productIngredientsRepository: Repository<ProductIngredient>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name, price, productIngredients } = createProductDto;

    const product = this.productsRepository.create({ name, price });

    await this.productsRepository.save(product);
    
    const productIngredientEntities = productIngredients.map(item => {
      return this.productIngredientsRepository.create({
        quantity: item.quantity,
        product: product, 
        ingredient: { id: item.ingredientId }
      });
    });

    await this.productIngredientsRepository.save(productIngredientEntities);
    
    product.productIngredients = productIngredientEntities;
    return product;
  }

  async findAll() {
    return await this.productsRepository.find({
      relations: {
        productIngredients: {
          ingredient: true
        }
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
