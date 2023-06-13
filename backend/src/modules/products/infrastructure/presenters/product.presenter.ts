import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../domain/entity/product.entity';
import { Price } from '@common/types/price.type';
import { Category } from '@modules/categories/domain/entity/category.entity';

export class ProductPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sku?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  category?: Category;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt?: Date;

  @ApiProperty()
  price: Price;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
