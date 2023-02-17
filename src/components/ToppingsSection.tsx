import type { Topping } from '@prisma/client';

type ToppingsProps = {
  toppings: Topping[];
};

export function ToppingsSection({ toppings }: ToppingsProps) {
  return (
    <div>
      <span className='my-2'>Добавить по вкусу</span>
      <ul className='grid w-full grid-cols-3 gap-2'>
        {toppings.map((topping) => {
          if (!topping) return null;
          return (
            <li
              key={topping.id}
              className='flex flex-col items-center rounded-xl bg-white p-2 shadow-[rgba(6,5,50,0.12)_0px_4px_20px]'
            >
              {/* <div className='aspect-square w-full bg-amber-200' /> */}
              <img className='aspect-square w-full' alt='' />
              <span className='h-8 text-center text-xs'>
                {topping.toppingName}
              </span>
              <span className=''>{`${topping.price}₽`}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
