import { mockCategory } from '@modules/categories/domain/mocks/category.mock';
import { Product } from '../entity/product.entity';

export const mockProduct: Product = {
  id: '0524d403-3928-4397-99ff-a6e514b8f5b2',
  name: 'Product 1',
  sku: 'SKU-001',
  description: 'A super product',
  price: {
    value: 100,
    currencyCode: 'USD',
  },
  category: mockCategory,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const mockProductList: Product[] = [
  {
    id: '0524d403-3928-4397-99ff-a6e514b8f5b2',
    name: 'Product 1',
    sku: 'SKU-001',
    description: 'A super product',
    price: {
      value: 100,
      currencyCode: 'USD',
    },
    category: mockCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '0524c403-3928-4397-99ff-a6e514b0f5b6',
    name: 'Product 2',
    sku: 'SKU-002',
    description: 'A super product 2.0',
    price: {
      value: 200,
      currencyCode: 'USD',
    },
    category: mockCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];
