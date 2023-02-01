import type {
  IngredientState,
  MenuPositionState,
  ProductState,
  ToppingState,
} from 'types/client';
import type { RouterInputs } from 'utils/api';
import { api } from 'utils/api';
import { reduceToStateObject } from 'utils/common';

export function useMenuPositions({
  category,
}: RouterInputs['entities']['getPositions']) {
  return api.entities.getPositions.useQuery(
    {
      category,
    },
    {
      staleTime: Infinity,
      select: ({ ingredients, menuPositions, products, toppings }) => ({
        menuPositions: menuPositions.reduce<MenuPositionState>(
          reduceToStateObject,
          {
            ids: [],
            entities: {},
          } satisfies MenuPositionState
        ),

        ingredients: ingredients.reduce<IngredientState>(reduceToStateObject, {
          ids: [],
          entities: {},
        } satisfies IngredientState),

        products: products.reduce<ProductState>(reduceToStateObject, {
          ids: [],
          entities: {},
        } satisfies ProductState),

        toppings: toppings.reduce<ToppingState>(reduceToStateObject, {
          ids: [],
          entities: {},
        } satisfies ToppingState),
      }),
    }
  );
}
