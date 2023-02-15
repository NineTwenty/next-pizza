import type { ProductState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';

export function ComboForm({
  description,
  position,
  products,
}: {
  description: string;
  products: ProductState;
  position: DenormalizedMenuPosition;
}) {
  return (
    <>
      {description}
      <ul className='flex flex-col gap-4'>
        {position.categoryMap.map((categoryMap) => (
          <li
            key={categoryMap.id}
            className='flex rounded-xl bg-white p-4 shadow-md'
          >
            <div className='mr-4 flex aspect-square w-32 items-center justify-center rounded-full bg-orange-200 text-center'>
              {products.entities[categoryMap.defaultProduct]?.productName}
            </div>
            <section>
              <h3 className='font-medium'>
                {products.entities[categoryMap.defaultProduct]?.productName}
              </h3>
              <button
                type='button'
                className='my-3 block h-8 w-fit min-w-[6rem] rounded-full bg-orange-100 text-sm leading-8 text-orange-700'
              >
                Изменить
              </button>
            </section>
          </li>
        ))}
      </ul>
    </>
  );
}
