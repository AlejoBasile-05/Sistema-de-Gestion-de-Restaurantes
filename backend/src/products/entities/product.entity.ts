import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductIngredient } from "./product-ingredient.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'varchar', length: 255})
    name: string;

    @Column({type:'decimal', precision: 10, scale: 2})
    price: number;

    @OneToMany(() => ProductIngredient, (productIngredient) => productIngredient.product)
    productIngredients: ProductIngredient[];
}