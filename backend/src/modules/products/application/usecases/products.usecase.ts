import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entity/product.entity';

@Injectable()
export class ProductsUseCase {
  private readonly logger = new Logger(ProductsUseCase.name);
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category'],
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async updateProduct(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    const product = await this.getProductById(id);
    if (!product) {
      return null;
    }

    Object.assign(product, productData);
    return this.productsRepository.save(product);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.productsRepository.delete(id);
    return result.affected > 0;
  }
}
