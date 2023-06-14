import { Module } from '@nestjs/common';
import { CategoriesService } from './application/services/categories.service';
import { CategoriesController } from './infrastructure/controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './domain/entity/category.entity';
import { CategoriesUseCase } from './application/usecases/categories.usecase';
import { CategoriesSearchUseCase } from './application/usecases/categories-search.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesUseCase, CategoriesSearchUseCase],
  exports: [TypeOrmModule, CategoriesUseCase],
})
export class CategoriesModule {}
