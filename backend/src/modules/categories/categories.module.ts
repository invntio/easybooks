import { Module } from '@nestjs/common';
import { CategoriesService } from './application/services/categories.service';
import { CategoriesController } from './infrastructure/controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './domain/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [TypeOrmModule],
})
export class CategoriesModule {}
