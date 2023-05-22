import type { Ingredient } from '@prisma/client';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { NormalizedMenuPosition, NormalizedProduct } from 'types/server';
import pizzaPic from 'assets/pizza-icon.svg';
import { useMenuPositions } from 'utils/apiHooks';

type MenuPositionProps = {
  name: NormalizedMenuPosition['menuPositionName'];
  position: NormalizedMenuPosition;
  children: (props: {
    positionIngredients: Ingredient[];
    closeCallback: () => void;
  }) => ReactNode;
};

export function MenuPosition({ name, position, children }: MenuPositionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useMenuPositions({
    category: position.categoryId,
  });

  // Find initialy displayed position price
  const price = useMemo(() => {
    if (!data) return 0;

    return position.categoryMap.reduce((minPositionPrice, map) => {
      const includedProducts = map.products
        .map((productId) => data.products.entities[productId])
        .filter((product): product is NormalizedProduct => !!product);

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
    }, 0);
  }, [data, position.categoryMap]);

  const activeIngredients = useMemo(() => {
    if (!data) return [];

    return position.categoryMap.reduce<Ingredient[]>(
      (accIngredients, { defaultProduct: defaultProductId }) => {
        const defaultProduct = data.products.entities[defaultProductId];

        defaultProduct?.ingredients.forEach((id) => {
          const ingredient = data.ingredients.entities[id];
          if (ingredient) {
            accIngredients.push(ingredient);
          }
        });

        return accIngredients;
      },
      []
    );
  }, [data, position.categoryMap]);

  const Modal =
    typeof window === 'object' &&
    isOpen &&
    children({
      positionIngredients: activeIngredients,
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
          {position.description ||
            activeIngredients
              .map(({ ingredientName }) => ingredientName)
              .join(', ')}
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
