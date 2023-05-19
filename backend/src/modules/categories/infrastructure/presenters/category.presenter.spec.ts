import { CategoryPresenter } from './category.presenter';
import { Category } from '../../domain/entity/category.entity';
import { v4 as uuidV4 } from 'uuid';

describe('CategoryPresenter', () => {
  describe('constructor', () => {
    it('should assign values correctly', () => {
      const category: Category = {
        id: uuidV4(),
        name: 'Category 1',
        parentId: uuidV4(),
        isActive: true,
        createdAt: new Date(),
      };

      const presenter = new CategoryPresenter(category);

      expect(presenter.id).toBe(category.id);
      expect(presenter.name).toBe(category.name);
      expect(presenter.parentId).toBe(category.parentId);
      expect(presenter.isActive).toBe(category.isActive);
      expect(presenter.createdAt).toBe(category.createdAt);
    });

    it('should assign undefined values if not provided', () => {
      const category: Category = {
        id: uuidV4(),
        name: 'Category 1',
        isActive: true,
        createdAt: new Date(),
      };

      const presenter = new CategoryPresenter(category);

      expect(presenter.parentId).toBeUndefined();
      expect(presenter.subcategories).toBeUndefined();
    });
  });
});
