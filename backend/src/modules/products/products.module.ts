import { Module } from '@nestjs/common';
import { ProductsService } from './application/services/products.service';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entity/product.entity';
import { ProductsUseCase } from './application/usecases/products.usecase';
import { ProductsSearchUseCase } from './application/usecases/products-search.usecase';
import { CategoriesModule } from '@modules/categories/categories.module';
import { ProductCategoriesService } from './application/services/products-categories-service.abstract';
import { ProductCategoriesUseCaseService } from './application/services/products-categories-usecase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsUseCase,
    ProductsSearchUseCase,
    {
      provide: ProductCategoriesService,
      useClass: ProductCategoriesUseCaseService,
    },
  ],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
