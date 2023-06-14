import { Price } from '@common/types/price.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop',
    description: 'The name of the product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'SKU-001',
    description: 'The SKU of the product',
  })
  @IsOptional()
  @IsString()
  public sku?: string;

  @ApiProperty({
    example: 'A super laptop',
    description: 'The description of the product',
  })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({
    example: 'f313b4ac-7c7b-48d3-8ca3-208a2c770324',
    description: 'The id of the product category',
  })
  @IsOptional()
  @IsUUID('4')
  public categoryId?: string;

  @ApiProperty({
    example: {
      value: 100,
      currencyCode: 'USD',
    },
    description: 'The price of the category',
  })
  @IsNotEmpty()
  public price: Price;
}
