import type { Ingredient, Topping } from '@prisma/client';
import type { NormalizedMenuPosition, NormalizedProduct } from 'types/server';

export interface EntityState<T extends { id: number }> {
  ids: number[];
  entities: { [key: number]: T };
}

export type MenuPositionState = EntityState<NormalizedMenuPosition>;
export type ProductState = EntityState<NormalizedProduct>;
export type IngredientState = EntityState<Ingredient>;
export type ToppingState = EntityState<Topping>;
