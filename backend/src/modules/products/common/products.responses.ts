export const PRODUCTS_RESPONSES = {
  CREATED: 'Product created',
  FOUND_ONE: 'Product found',
  FOUND_MANY: 'Products found',
  UPDATED: 'Product updated',
  DELETED: 'Product deleted',
  NOT_CREATED: 'Product not created',
  NOT_FOUND_ONE: 'Product not found',
  NOT_FOUND_MANY: 'Products not found',
  NOT_UPDATED: 'Product not updated',
  NOT_DELETED: 'Product not deleted',
  CATEGORY_NOT_EXIST: 'Category with this id does not exist',
  ALREADY_EXISTS: (prop: string) => `Product this ${prop} already exists`,
};
