import type { Topping } from '@prisma/client';
import type { PositionFormState } from 'components/MenuPositionModal';
import { CheckCircle } from 'react-feather';
import { useFormContext } from 'react-hook-form';

type ToppingSectionProps = {
  toppings: Topping[];
  fieldGroupId: number;
};

export function ToppingsSection({
  toppings,
  fieldGroupId,
}: ToppingSectionProps) {
  const { register } = useFormContext<PositionFormState>();
  return (
    <section>
      <div className='mb-3 mt-6 font-medium leading-5'>Добавить по вкусу</div>
      <ul className='grid w-full grid-cols-3 gap-2'>
        {toppings.map((topping) => {
          if (!topping) return null;
          return (
            <li key={topping.id} className='relative'>
              <label>
                <input
                  type='checkbox'
                  value={topping.id}
                  {...register(`categoryMaps.${fieldGroupId}.includedToppings`)}
                  className='peer sr-only'
                />
                <div className='flex flex-col items-center rounded-xl border border-white bg-white p-2 shadow-[rgba(6,5,50,0.12)_0px_4px_20px] transition duration-150 ease-out peer-checked:border-orange-600  peer-checked:shadow-none'>
                  <img className='aspect-square w-full' alt='' />
                  <span className='h-8 text-center text-xs'>
                    {topping.toppingName}
                  </span>
                  <span className='tracking-wide'>{`${topping.price}₽`}</span>
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
