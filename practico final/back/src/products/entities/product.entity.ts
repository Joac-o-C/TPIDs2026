// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';

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

  @ManyToOne(() => CategoryEntity, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;
}
