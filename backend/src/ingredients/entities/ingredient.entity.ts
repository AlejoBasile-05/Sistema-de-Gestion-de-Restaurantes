import { ProductIngredient } from 'src/products/entities/product-ingredient.entity';
import { StockMovement } from 'src/stock-movements/entities/stock-movement.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Unidades {
  KG= 'kg',
  LITRO = 'litro',
  UNIDAD = 'unidad',
}

@Entity()
export class Ingredient {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'enum', enum: Unidades })
    unit: Unidades;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cost: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    stock: number; 

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    minStock: number; 

    @Column({ type: 'varchar', length: 255 })
    category: string;

    @OneToMany(() => StockMovement, (stockMovement) => stockMovement.ingredient)
    stockMovements: StockMovement[];

    @OneToMany(() => ProductIngredient, (productIngredient) => productIngredient.ingredient)
    productIngredients: ProductIngredient[];
}
