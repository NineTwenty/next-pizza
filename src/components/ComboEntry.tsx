import type { ReactElement } from 'react';
import Image from 'next/image';
import pizzaPic from 'assets/pizza-icon.svg';

export function ComboEntry({
  productName,
  description,
  render,
  variationInfo,
  disabled = false,
  isExtraOpen,
  isProductOpen,
  openExtra,
  toggleProduct,
}: {
  productName: string;
  description: string;
  render: () => ReactElement;
  variationInfo: string;
  disabled?: boolean;
  isProductOpen: boolean;
  isExtraOpen: boolean;
  openExtra: () => void;
  toggleProduct: () => void;
}) {
  return (
    <article
      className={`${
        isProductOpen
          ? 'md:border-orange-600 md:shadow-[rgba(6,5,50,0.12)_0px_0px_8px]'
          : ''
      } relative z-[inherit] my-3 flex rounded-xl border border-white bg-white shadow-[rgb(6,5,50,10%)_0px_4px_16px] transition-[border-color,box-shadow] ease-out md:place-items-start md:p-3`}
    >
      <div className='mr-1 flex aspect-square w-5/12 p-2 text-center md:mr-2 md:w-1/5 md:p-0'>
        <Image className='w-full' alt='' src={pizzaPic as string} />
      </div>
      <section className='flex flex-col justify-center md:w-4/5'>
        <h3 className='font-bold'>{productName}</h3>
        <p className='mt-1 text-xs font-medium'>{variationInfo}</p>
        <p className='mt-1 hidden text-xs text-gray-600 first-letter:uppercase md:block'>
          {description}
        </p>
        <button
          type='button'
          disabled={disabled}
          className='absolute left-0 top-0 h-full w-full rounded-xl text-transparent'
          onClick={() => {
            toggleProduct();
          }}
        >
          Заменить
        </button>
        <div
          className={`${
            isExtraOpen || disabled ? 'hidden' : 'block'
          } mt-3 flex h-8 place-items-center text-sm font-bold text-orange-700`}
        >
          <div
            className={`${
              isProductOpen ? 'md:-mr-[6rem] md:opacity-0' : 'opacity-100'
            } mr-4 w-[6rem] rounded-full bg-orange-100 text-center leading-8 transition-[opacity,margin-right]`}
          >
            Заменить
          </div>
          <button
            type='button'
            disabled={disabled}
            className='z-[1] hidden md:block'
            onClick={() => {
              openExtra();
            }}
          >
            Изменить состав
          </button>
        </div>
        <div>{isProductOpen ? render() : null}</div>
      </section>
      <div
        className={`${
          disabled ? 'block' : 'hidden'
        } absolute left-0 top-0 z-10 h-full w-full rounded-xl bg-white/70`}
      />
    </article>
  );
}
