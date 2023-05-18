import type { Ingredient } from '@prisma/client';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { IngredientState, ProductState } from 'types/client';
import type {
  DenormalizedMenuPosition,
  DenormalizedProduct,
} from 'types/server';
import { capitalizeFirstLetter } from 'utils/common';
import pizzaPic from 'assets/pizza-icon.svg';

type MenuPositionProps = {
  name: DenormalizedMenuPosition['menuPositionName'];
  position: DenormalizedMenuPosition;
  products: ProductState;
  ingredients: IngredientState;
  children: (props: {
    positionIngredients: Ingredient[];
    description: string;
    closeCallback: () => void;
  }) => ReactNode;
};

export function MenuPosition({
  name,
  position,
  ingredients,
  products,
  children,
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

  const Modal =
    typeof window === 'object' &&
    isOpen &&
    children({
      positionIngredients: activeIngredients,
      description,
      closeCallback: () => {
        setIsOpen(false);
      },
    });

  return (
    <button
      type='button'
      onClick={() => {
        setIsOpen(true);
      }}
      className='flex w-full border-b border-slate-100 py-6 text-left last:border-b-0 md:flex-col md:border-b-0 md:p-0'
    >
      <div className='mr-1 max-w-[38%] p-[0_0.5rem_0.5rem] md:mr-0 md:max-w-full'>
        <Image alt='' src={pizzaPic as string} />
      </div>
      <article className='flex flex-col'>
        <h3 className='text-lg font-semibold md:mb-2 md:text-xl'>{name}</h3>
        <p className='text-xs font-medium tracking-tight text-gray-500 first-letter:capitalize md:h-24 md:text-base md:leading-5'>
          {description}
        </p>
        <div className='flex place-items-center justify-between'>
          <span className='hidden font-semibold md:block'>
            {'от '}
            <span className='whitespace-nowrap'>{`${price} ₽`}</span>
          </span>
          <div className='my-3 block h-8 w-fit min-w-[6rem] rounded-full bg-orange-100 text-center text-sm font-semibold leading-8 text-orange-700 hover:bg-orange-200 md:h-10 md:min-w-[7.50rem] md:px-5 md:py-2 md:text-base'>
            <span className='md:hidden'>{`от ${price} ₽`}</span>
            <span className='hidden md:block'>Выбрать</span>
          </div>
        </div>
      </article>
      {Modal}
    </button>
  );
}
