import type {
  Category,
  CategoryDiscount,
  Ingredient,
  MenuPosition,
  MenuPosition_Category,
  Product,
  ProductVariation,
  Topping,
} from '@prisma/client';

export type NormalizedProduct = {
  id: Product['id'];
  productName: Product['productName'];
  variations: ProductVariation[];
  toppings: Topping['id'][];
  ingredients: Ingredient['id'][];
};

export type CategoryMap = {
  id: MenuPosition_Category['id'];
  categoryId: Category['id'];
  categoryDiscount: CategoryDiscount['discountSize'];
  products: Product['id'][];
  defaultProduct: Product['id'];
};

export type NormalizedMenuPosition = {
  id: MenuPosition['id'];
  menuPositionName: MenuPosition['menuPositionName'];
  description: MenuPosition['description'] | null;
  categoryId: Category['id'];
  categoryMap: CategoryMap[];
};

export type GetPositionsResponse = {
  menuPositions: NormalizedMenuPosition[];
  toppings: Topping[];
  ingredients: Ingredient[];
  products: NormalizedProduct[];
};
