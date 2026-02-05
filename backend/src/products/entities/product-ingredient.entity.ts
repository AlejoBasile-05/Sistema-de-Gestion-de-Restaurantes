import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from './product.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';

@Entity()
export class ProductIngredient {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @ManyToOne(() => Product, (product) => product.productIngredients)
    product: Product;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredients)
    ingredient: Ingredient;

}