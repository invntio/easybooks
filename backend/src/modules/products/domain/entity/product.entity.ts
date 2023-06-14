import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Category } from '@modules/categories/domain/entity/category.entity';
import { Price } from '@common/types/price.type';

@Entity()
export class Product extends BaseEntity {
  @Column({ nullable: false, unique: true })
  public name: string;

  @Column({ nullable: true, unique: true })
  public sku?: string;

  @Column({ nullable: true })
  public description?: string;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  @JoinColumn()
  public category?: Category;

  // @Column({ nullable: true, select: false })
  // public categoryId?: string;

  @Column('json', { nullable: false })
  public price: Price;
}
