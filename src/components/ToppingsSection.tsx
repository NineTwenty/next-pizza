import type { Topping } from '@prisma/client';
import { useFormContext } from 'react-hook-form';

type ToppingsProps = {
  toppings: Topping[];
};

const fieldName = 'includedIngredients';
export function ToppingsSection({ toppings }: ToppingsProps) {
  const { register, watch, getValues } = useFormContext();
  const toppingsState = getValues(fieldName);
  watch((data) => console.log(data));
  return (
    <div>
      <span className='my-2'>Добавить по вкусу</span>
      <ul className='grid w-full grid-cols-3 gap-2'>
        {toppings.map((topping) => {
          if (!topping) return null;
          return (
            <li key={topping.id}>
              <label>
                <input
                  type='checkbox'
                  value={topping.id}
                  {...register(fieldName)}
                  className='peer sr-only'
                />
                {/* <div className='aspect-square w-full bg-amber-200' /> */}
                <div className='flex flex-col items-center rounded-xl border bg-white p-2 shadow-[rgba(6,5,50,0.12)_0px_4px_20px]  peer-checked:border-red-400'>
                  <img className='aspect-square w-full' alt='' />
                  <span className='h-8 text-center text-xs'>
                    {topping.toppingName}
                  </span>
                  <span className=''>{`${topping.price}₽`}</span>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
