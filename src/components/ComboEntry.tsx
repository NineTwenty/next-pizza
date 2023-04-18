import type { ReactElement } from 'react';

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
      } relative z-[inherit] my-4 flex rounded-xl border border-white bg-white p-4 shadow-[rgb(6,5,50,10%)_0px_4px_16px] transition-[border-color,box-shadow] ease-out`}
    >
      <div className='mr-4 flex aspect-square w-1/3 items-center justify-center rounded-full bg-orange-200 text-center md:w-1/5'>
        {productName}
      </div>
      <section>
        <h3 className='font-bold'>{productName}</h3>
        <p className='mt-1 text-xs font-medium'>{variationInfo}</p>
        <p className='mt-1 hidden text-xs text-gray-600 first-letter:uppercase md:block'>
          {description}
        </p>
        <button
          type='button'
          disabled={disabled}
          className='absolute top-0 left-0 h-full w-full rounded-xl text-transparent'
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
        } absolute top-0 left-0 z-10 h-full w-full rounded-xl bg-white/70`}
      />
    </article>
  );
}
