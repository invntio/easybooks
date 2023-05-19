import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: '391180de-1f08-45ff-91a0-bd1965cbd1b9',
    description: "The id of the category's parent",
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    default: true,
    example: true,
    description: 'Indicates if the category is activated or not',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
