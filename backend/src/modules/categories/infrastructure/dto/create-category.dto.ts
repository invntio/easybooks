import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

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
