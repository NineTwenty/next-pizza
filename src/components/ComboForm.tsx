import type { PositionState } from 'components/MenuPositionModal';
import type { ProductState } from 'types/client';

export function ComboForm({
  products,
  positions,
}: {
  products: ProductState;
  positions: PositionState[];
}) {
  return (
    <ul className='flex flex-col gap-4'>
      {positions.map((categoryMap) => (
        <li
          key={categoryMap.id}
          className='flex rounded-xl bg-white p-4 shadow-md'
        >
          <div className='mr-4 flex aspect-square w-32 items-center justify-center rounded-full bg-orange-200 text-center'>
            {products.entities[categoryMap.product]?.productName}
          </div>
          <section>
            <h3 className='font-medium'>
              {products.entities[categoryMap.product]?.productName}
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
  );
}
