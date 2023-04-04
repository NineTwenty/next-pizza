import { useOrders } from 'hooks/useOrders';
import { ChevronRight } from 'react-feather';

function getNoun(number: number, one: string, two: string, five: string) {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}

export function Cart() {
  const { orders } = useOrders();
  const orderPrice = orders.reduce(
    (price, order) => price + order.totalPrice,
    0
  );

  const orderItems = orders.map(({ positionName }) => (
    <div>{positionName}</div>
  ));

  return (
    <div className='border-t'>
      <h2 className='p-4 text-2xl'>
        {`${orders.length} ${getNoun(
          orders.length,
          'товар',
          'товара',
          'товаров'
        )} на ${orderPrice} ₽`}
      </h2>
      <div className='flex flex-col gap-2 bg-gray-100'>{orderItems}</div>
      <div className='h-10 bg-gray-100' />
      <div className='p-4'>
        <div className='flex py-3'>
          <input className='w-full' placeholder='Промокод' />
          <button type='button' className='px-2 text-sm text-orange-600'>
            Применить
          </button>
        </div>
        <div className='border-y py-4 text-xs font-medium'>
          <p className='flex justify-between'>
            {`${orders.length} `}
            {getNoun(orders.length, 'товар', 'товара', 'товаров')}
            <span>{orderPrice}</span>
          </p>
          <p className='flex justify-between py-2'>
            Начислим бонусов <span>+{Math.floor(orderPrice / 20)}</span>
          </p>
          <p className='flex justify-between'>
            Доставка <span>Бесплатно</span>
          </p>
        </div>
        <div>
          <p className='flex justify-between py-4 font-medium'>
            Сумма заказа <span>{orderPrice} ₽</span>
          </p>
          <button
            type='button'
            className='flex w-full place-items-center justify-center rounded-full bg-orange-500 p-3 text-base font-normal text-white'
          >
            <span className='mx-auto'>К оформлению заказа</span>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
