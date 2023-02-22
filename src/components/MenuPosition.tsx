import type { Ingredient } from '@prisma/client';
import { useMemo, useState } from 'react';
import type { IngredientState, ProductState, ToppingState } from 'types/client';
import type {
  DenormalizedMenuPosition,
  DenormalizedProduct,
} from 'types/server';
import { capitalizeFirstLetter } from 'utils/common';
import { MenuPositionModal } from 'components/MenuPositionModal';

type MenuPositionProps = {
  position: DenormalizedMenuPosition;
  products: ProductState;
  ingredients: IngredientState;
  toppings: ToppingState;
};

export function MenuPosition({
  position,
  ingredients,
  products,
  toppings,
}: MenuPositionProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Find initialy displayed position price
  const [price] = useState(() =>
    position.categoryMap.reduce((minPositionPrice, map) => {
      const includedProducts = map.products
        .map((productId) => products.entities[productId])
        .filter((product): product is DenormalizedProduct => !!product);

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

  const activeIngredients = useMemo(
    () =>
      position.categoryMap.reduce<Ingredient[]>(
        (accIngredients, { defaultProduct: defaultProductId }) => {
          const defaultProduct = products.entities[defaultProductId];
          const defaultProductIngredients = defaultProduct?.ingredients
            .map((id) => ingredients.entities[id])
            .filter((ingredient): ingredient is Ingredient => !!ingredient);

          if (!defaultProduct || !defaultProductIngredients) {
            return [];
          }

          return [...accIngredients, ...defaultProductIngredients];
        },
        []
      ),
    [ingredients.entities, position.categoryMap, products.entities]
  );

  // Assign description
  const description =
    position.description ??
    capitalizeFirstLetter(
      activeIngredients.map(({ ingredientName }) => ingredientName).join(', ')
    );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <article
      onClick={() => {
        setIsOpen(true);
      }}
      className='flex border-b border-slate-100 py-6 last:border-b-0'
    >
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
      {typeof window === 'object' && isOpen && (
        <MenuPositionModal
          position={position}
          ingredients={activeIngredients}
          name={position.menuPositionName}
          toppings={toppings}
          products={products}
          description={description}
          closeCallback={() => {
            setIsOpen(false);
          }}
        />
      )}
    </article>
  );
}
