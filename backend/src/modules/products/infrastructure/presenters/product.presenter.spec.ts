import { ProductPresenter } from './product.presenter';
import { Product } from '../../domain/entity/product.entity';
import { v4 as uuidV4 } from 'uuid';

describe('ProductPresenter', () => {
  describe('constructor', () => {
    it('should assign values correctly', () => {
      const product: Partial<Product> = {
        id: uuidV4(),
        name: 'Product 1',
        createdAt: new Date(),
      };
      // TODO: Add missing props

      const presenter = new ProductPresenter(product);

      expect(presenter.id).toBe(product.id);
      expect(presenter.name).toBe(product.name);
    });
  });
});
