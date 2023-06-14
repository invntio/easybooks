import { ProductPresenter } from './product.presenter';
import { Product } from '../../domain/entity/product.entity';

describe('ProductPresenter', () => {
  describe('constructor', () => {
    it('should assign values correctly', () => {
      const product: Product = {
        id: '38a9e8a3-9394-4ebf-ac71-bd65715e605e',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        name: 'Product 1',
        sku: 'SKU-001',
        description: 'A super product',
        price: {
          value: 100,
          currencyCode: 'USD',
        },
        category: {
          id: 'e6aa8568-b090-4912-87dc-5f3ce5e2e867',
          name: 'Electronics',
          isActive: true,
          createdAt: new Date(),
        },
      };

      const presenter = new ProductPresenter(product);

      expect(presenter.id).toBe(product.id);
      expect(presenter.name).toBe(product.name);
      expect(presenter.sku).toBe(product.sku);
      expect(presenter.category).toEqual(product.category);
      expect(presenter.price).toBe(product.price);
      expect(presenter.description).toBe(product.description);
      expect(presenter.createdAt).toBe(product.createdAt);
      expect(presenter.updatedAt).toBe(product.updatedAt);
      expect(presenter.deletedAt).toBe(product.deletedAt);
    });
  });
});
