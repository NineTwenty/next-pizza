import type { Topping } from '@prisma/client';
import { usePositionFormContext } from 'hooks/usePositionForm';
import { CheckCircle } from 'react-feather';

type ToppingSectionProps = {
  toppings: Topping[];
  fieldGroupId: number;
  productId: number;
  type?: 'grid' | 'column';
};

export function ToppingsSection({
  type = 'grid',
  toppings,
  fieldGroupId,
  productId,
}: ToppingSectionProps) {
  const { register } = usePositionFormContext();
  const isColumn = type === 'column';
  return (
    <section
      data-testid='toppings_section'
      className={`${isColumn ? 'px-4' : ''}`}
    >
      <div
        className={`${
          isColumn ? 'text-lg' : ''
        } mb-3 mt-6 font-medium leading-5`}
      >
        Добавить по вкусу
      </div>
      <ul
        className={`${
          isColumn ? 'grid-cols-1' : 'grid-cols-3'
        } grid w-full gap-2`}
      >
        {toppings.map((topping) => {
          if (!topping) return null;
          return (
            <li key={topping.id} className='relative'>
              <label>
                <input
                  type='checkbox'
                  value={topping.id}
                  {...register(
                    `categoryMaps.${fieldGroupId}.byProductState.${productId}.includedToppings`
                  )}
                  className='peer sr-only'
                />
                <div
                  className={`${
                    isColumn ? 'gap-1' : 'flex-col'
                  } flex items-center rounded-xl border border-white bg-white p-2 shadow-[rgba(6,5,50,0.12)_0px_4px_20px] transition duration-150 ease-out peer-checked:border-orange-600  peer-checked:shadow-none`}
                >
                  <img
                    className={`${isColumn ? 'w-12' : 'w-full'} aspect-square`}
                    alt=''
                  />
                  <div className={`${isColumn ? 'flex flex-col ' : ''}`}>
                    <p
                      className={`${
                        isColumn
                          ? 'text-sm font-medium leading-[1.125rem]'
                          : 'h-8 text-xs'
                      } text-center`}
                    >
                      {topping.toppingName}
                    </p>
                    <p
                      className={`${
                        isColumn
                          ? 'text-sm leading-[1.125rem] text-gray-600'
                          : 'text-center'
                      } 'tracking-wide'`}
                    >
                      {isColumn ? `+${topping.price} ₽` : `${topping.price}₽`}
                    </p>
                  </div>
                </div>
                <CheckCircle
                  aria-hidden
                  className='absolute top-2 right-2 h-5 w-5 text-orange-600 opacity-0 transition-opacity ease-out peer-checked:opacity-100'
                />
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
