import type { Ingredient, Topping } from '@prisma/client';
import { useMemo, useState } from 'react';
import type {
  DenormalizedMenuPosition,
  DenormalizedProduct,
} from 'types/server';
import { capitalizeFirstLetter } from 'utils/common';

type MenuPositionProps = {
  position: DenormalizedMenuPosition;
  products: DenormalizedProduct[];
  ingredients: Ingredient[];
  toppings: Topping[];
};

export function MenuPosition({
  position,
  ingredients,
  products,
  toppings,
}: MenuPositionProps) {
  // Find initialy displayed position price
  const [price] = useState(() =>
    position.categoryMap.reduce((minPositionPrice, map) => {
      const includedProducts = products.filter(({ id }) =>
        map.products.includes(id)
      );

      return (
        minPositionPrice +
        Math.min(
          ...includedProducts.flatMap(({ variations }) =>
            Math.min(
              ...variations.map(({ price: variantPrice }) => variantPrice)
            )
          )
        )
      );
    }, 0)
  );

  // Assign description
  const description = useMemo(() => {
    if (position.description) {
      return position.description;
    }

    // Make missing description from ingredients list
    return capitalizeFirstLetter(
      position.categoryMap.reduce((_, { defaultProduct: defaultProductId }) => {
        const defaultProduct = products.find(
          (product) => product.id === defaultProductId
        );

        return ingredients
          .filter(({ id }) => defaultProduct?.ingredients.includes(id))
          .map(({ ingredientName }) => ingredientName)
          .join(', ');
      }, '')
    );
  }, [position, ingredients, products]);

  return (
    <article className='flex border-b border-slate-100 py-6 last:border-b-0'>
      <div className='m-2 mr-4 flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-orange-200 p-4 text-center'>
        {/* TODO: Use actual position image */}
        {position.menuPositionName}
      </div>
      <main className='flex flex-col'>
        <h3 className='text-lg'>{position.menuPositionName}</h3>
        <p className='text-xs text-gray-600'>{description}</p>
        <button
          type='button'
          className='my-3 block h-8 w-fit min-w-[6rem] rounded-full bg-orange-100 text-sm leading-8 text-orange-700'
        >{`от ${price} ₽`}</button>
      </main>
    </article>
  );
}
