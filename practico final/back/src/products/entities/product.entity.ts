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

  @Column('integer', { nullable: true })
  categoryId!: number | null;

  @ManyToOne(() => CategoryEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity | null;
}
