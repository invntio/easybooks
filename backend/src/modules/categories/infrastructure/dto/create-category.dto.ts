import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsBooleanString,
  IsDefined,
  ValidationError,
  IS_BOOLEAN,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    default: true,
    example: true,
    description: 'Indicates if the category is active or not',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
