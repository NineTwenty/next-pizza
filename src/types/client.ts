import type { Ingredient, Topping } from '@prisma/client';
import type {
  DenormalizedMenuPosition,
  DenormalizedProduct,
} from 'types/server';

export interface EntityState<T extends { id: number }> {
  ids: number[];
  entities: { [key: number]: T };
}

export type MenuPositionState = EntityState<DenormalizedMenuPosition>;
export type ProductState = EntityState<DenormalizedProduct>;
export type IngredientState = EntityState<Ingredient>;
export type ToppingState = EntityState<Topping>;
