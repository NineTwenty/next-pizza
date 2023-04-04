import { Modal } from 'components/Modal';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { X } from 'react-feather';

export function ComboEntry({
  productName,
  children,
  variationInfo,
}: {
  productName: string;
  children: ReactElement;
  variationInfo: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <label className='my-4 flex flex-shrink-0 rounded-xl bg-white p-4 shadow-[rgb(6,5,50,10%)_0px_4px_16px]'>
      <div className='mr-4 flex aspect-square w-1/3 items-center justify-center rounded-full bg-orange-200 text-center'>
        {productName}
      </div>
      <section>
        <h3 className='font-medium'>{productName}</h3>
        <span className='text-xs'>{variationInfo}</span>
        <button
          type='button'
          className='my-3 block h-8 w-fit min-w-[6rem] rounded-full bg-orange-100 text-sm leading-8 text-orange-700'
          onClick={() => setIsOpen((oldIsOpen) => !oldIsOpen)}
        >
          Изменить
        </button>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div onClick={(e) => e.stopPropagation()}>
          {isOpen ? (
            <Modal>
              <div className='fixed inset-0 z-20 bg-black/60 backdrop-blur-2xl '>
                {children}
                <button
                  className='fixed top-2 right-2 z-50'
                  type='button'
                  onClick={() => setIsOpen(false)}
                >
                  <X className='h-8 w-8 text-white' />
                </button>
              </div>
            </Modal>
          ) : null}
        </div>
      </section>
    </label>
  );
}