import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('real')
  price!: number;

  @Column('integer', { default: 0 })
  stock!: number;

  @Column('integer')
  categoryId!: number;
}
