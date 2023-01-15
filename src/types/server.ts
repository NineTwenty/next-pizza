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

export type DenormalizedProduct = {
  id: Product['id'];
  productName: Product['productName'];
  variations: ProductVariation[];
  toppings: Topping['id'][];
  ingredients: Ingredient['id'][];
};

export type DenormalizedCategoryMap = {
  id: MenuPosition_Category['id'];
  categoryId: Category['id'];
  categoryDiscount: CategoryDiscount['discountSize'];
  products: Product['id'][];
  defaultProduct: Product['id'];
};

export type DenormalizedMenuPosition = {
  id: MenuPosition['id'];
  menuPositionName: MenuPosition['menuPositionName'];
  description: MenuPosition['description'] | null;
  categoryId: Category['id'];
  categoryMap: DenormalizedCategoryMap[];
};

export type GetPositionsResponse = {
  menuPositions: DenormalizedMenuPosition[];
  toppings: Topping[];
  ingredients: Ingredient[];
  products: DenormalizedProduct[];
};
