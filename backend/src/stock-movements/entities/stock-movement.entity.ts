import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity()
export class StockMovement {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @CreateDateColumn()
    movementDate: Date;

    @Column({ type: 'enum', enum: MovementType })
    type: MovementType;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.stockMovements)
    ingredient: Ingredient;
}

export class StockMovementArray {
      @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'enum', enum: MovementType })
    type: MovementType;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.stockMovements)
    ingredient: Ingredient;
}
