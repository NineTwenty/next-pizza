import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';

export function PizzaForm({
  position,
  description,
  products,
  toppings,
}: {
  products: ProductState;
  toppings: ToppingState;
  position: DenormalizedMenuPosition;
  description: string;
}) {
  const product =
    products.entities[
      position.categoryMap.reduce(
        (acc, { defaultProduct }) => defaultProduct,
        0
      )
    ];

  if (!product) return null;

  return (
    <>
      {description}
      <h4 className='my-2'>Добавить по вкусу</h4>
      <ul className='grid grid-cols-3 gap-2'>
        {product.toppings
          .map((toppingId) => toppings.entities[toppingId])
          .map((topping) => {
            if (!topping) return null;
            return (
              <li
                key={topping.id}
                className='flex flex-col items-center rounded-xl bg-white p-2 shadow-xl'
              >
                {/* <div className='aspect-square w-full bg-amber-200' /> */}
                <img className='aspect-square w-full' src='' alt='' />
                <span className='text-center text-xs'>
                  {topping.toppingName}
                </span>
                <span>{topping.price}</span>
              </li>
            );
          })}
      </ul>
    </>
  );
}
