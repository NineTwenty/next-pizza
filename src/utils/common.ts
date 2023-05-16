import type { Ingredient, Topping } from '@prisma/client';
import type { PositionProductState } from 'hooks/usePositionForm';
import type {
  EntityState,
  IngredientState,
  ProductState,
  ToppingState,
} from 'types/client';

type Only<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export function uniqueObjArray<T extends Record<string, unknown>>(
  objArray: T[],
  key: Only<T, string | number>
) {
  return [...new Map(objArray.map((item) => [item[key], item])).values()];
}

export function reduceToStateObject<T extends { id: number }>(
  acc: EntityState<T>,
  object: T
) {
  return {
    ids: [...acc.ids, object.id],
    entities: { ...acc.entities, [object.id]: object },
  };
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getEntities(
  targetProductId: number,
  targetProductState: PositionProductState,
  entities: {
    products: ProductState;
    ingredients: Ingredient[] | IngredientState;
    toppings: ToppingState;
  }
) {
  const {
    products: depProducts,
    ingredients: depIngredients,
    toppings: depToppings,
  } = entities;
  const product = depProducts.entities[targetProductId];

  if (!product) throw new Error('Missing entity');
  const variation = product.variations.find(
    (productVariation) => productVariation.id === targetProductState.variation
  );

  let ingredients;
  if (Array.isArray(depIngredients)) {
    ingredients = depIngredients.filter((ingredient) =>
      product.ingredients.includes(ingredient.id)
    );
  } else {
    ingredients = product.ingredients
      .map((id) => depIngredients.entities[id])
      .filter((ingredient): ingredient is Ingredient => !!ingredient);
  }

  const toppings = product.toppings
    .map((toppingId) => depToppings.entities[toppingId])
    .filter((topping): topping is Topping => !!topping);

  if (!variation) throw new Error('Missing entity');
  return {
    product,
    variation,
    ingredients,
    toppings,
  };
}
