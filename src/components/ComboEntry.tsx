import type { ReactElement } from 'react';
import { useState } from 'react';

export function ComboEntry({
  productName,
  render,
  variationInfo,
}: {
  productName: string;
  render: (close: () => void) => ReactElement;
  variationInfo: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <label className='my-4 flex flex-shrink-0 rounded-xl bg-white p-4 shadow-[rgb(6,5,50,10%)_0px_4px_16px]'>
      <div className='mr-4 flex aspect-square w-1/3 items-center justify-center rounded-full bg-orange-200 text-center'>
        {productName}
      </div>
      <section>
        <h3 className='font-bold'>{productName}</h3>
        <span className='text-xs font-medium'>{variationInfo}</span>
        <button
          type='button'
          className='my-3 block h-8 w-fit min-w-[6rem] rounded-full bg-orange-100 text-sm font-semibold leading-8 text-orange-700'
          onClick={() => setIsOpen((oldIsOpen) => !oldIsOpen)}
        >
          Изменить
        </button>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div onClick={(e) => e.stopPropagation()}>
          {isOpen ? render(() => setIsOpen(false)) : null}
        </div>
      </section>
    </label>
  );
}
