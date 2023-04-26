import type { Ingredient, Topping } from '@prisma/client';
import { useState } from 'react';
import Image from 'next/image';
import { MenuPositionForm } from 'components/MenuPositionForm';
import type { OrderEntry } from 'hooks/useOrders';
import { useOrders } from 'hooks/useOrders';
import { ChevronRight, Minus, Plus, X } from 'react-feather';
import { useMenuPositions } from 'utils/apiHooks';
import pizzaPic from 'assets/pizza-icon.svg';

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

function CartItem({ orderEntry }: { orderEntry: OrderEntry }) {
  const { updateOrder, deleteOrder } = useOrders();
  const { isSuccess, data } = useMenuPositions({
    category: orderEntry.categoryId,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!isSuccess) {
    return null;
  }
  const { ingredients, products, toppings, menuPositions } = data;
  const isCombo = orderEntry.order.length > 1;

  const position = menuPositions.entities[orderEntry.positionId];

  if (!position) {
    return null;
  }

  const positionIngredients = position.categoryMap.reduce<Ingredient[]>(
    (accIngredients, { defaultProduct: defaultProductId }) => {
      const defaultProduct = products.entities[defaultProductId];

      defaultProduct?.ingredients.forEach((id) => {
        const ingredient = ingredients.entities[id];
        if (ingredient) {
          accIngredients.push(ingredient);
        }
      });

      return accIngredients;
    },
    []
  );

  const ingredientsDescription = positionIngredients
    .map(({ ingredientName }) => ingredientName)
    .join(', ');

  function makeSummaryEntry(order: (typeof orderEntry.order)[number]) {
    const product = products.entities[order.product];
    const entryState = order.byProductState.find(
      ({ product: productId }) => productId === order.product
    );

    if (!entryState || !product) {
      throw new Error('Cannot render CartItem. Required entity is missing.');
    }

    const entryVariation = product.variations.find(
      ({ id }) => id === entryState.variation
    );
    const entryIngredients = entryState.excludedIngredients
      .map((id) => ingredients.entities[id])
      .filter(
        (ingredient): ingredient is Ingredient => !!ingredient?.ingredientName
      );
    const entryToppings = entryState.includedToppings
      .map((id) => toppings.entities[id])
      .filter((topping): topping is Topping => !!topping?.toppingName);

    if (!entryVariation) {
      throw new Error('Cannot render CartItem. Required entity is missing.');
    }

    return (
      <div key={order.id} className='mb-2 text-xs last:mb-0'>
        {isCombo ? <h4 className='mt-1'>{product.productName}</h4> : null}
        <p className={`${isCombo ? '' : 'pb-1'} text-gray-500`}>
          {`${entryVariation.size} ${entryVariation.weight}`}
        </p>
        {entryIngredients.length > 0 ? (
          <p className='lowercase text-gray-500'>
            {'+ '}
            {entryIngredients.map((ingredient, i, arr) => (
              <span key={ingredient.id}>
                {ingredient.ingredientName}
                {i === arr.length - 1 ? null : ', '}
              </span>
            ))}
          </p>
        ) : null}
        {entryToppings.length > 0 ? (
          <p className='lowercase  text-gray-500'>
            {'- '}
            {entryToppings.map((topping, i, arr) => (
              <span key={topping.id}>
                {topping.toppingName}
                {i === arr.length - 1 ? null : ', '}
              </span>
            ))}
          </p>
        ) : null}
      </div>
    );
  }

  const positionSummary = orderEntry.order.map(makeSummaryEntry);

  return (
    <section data-testid='cart' className='relative bg-white p-4'>
      <button
        type='button'
        aria-label={`Убрать заказ ${orderEntry.positionName}`}
        className='absolute right-6 top-4'
        onClick={() => deleteOrder(orderEntry.positionId)}
      >
        <X className='w-4' />
      </button>
      <section className='grid grid-flow-col grid-cols-[1fr,5fr] gap-4 pb-2'>
        <div className='mt-1 w-full'>
          <Image alt='' src={pizzaPic} />
        </div>
        <section className='flex flex-col justify-center'>
          <h3 className='mb-1 font-medium leading-5'>
            {orderEntry.positionName}
          </h3>
          <div>{positionSummary}</div>
        </section>
      </section>
      <section className='flex place-items-center border-t pt-4'>
        <span className='mr-auto font-medium'>{orderEntry.totalPrice} ₽</span>
        <button
          className='mr-3 text-sm font-bold text-orange-500'
          type='button'
          onClick={() => setIsFormOpen(true)}
        >
          Изменить
        </button>
        <div>
          {/* TODO: Add order edit button */}
          <div className='flex place-items-center rounded-full bg-gray-100 p-1 text-gray-800'>
            <button
              type='button'
              aria-label='decrease order count'
              className='px-1'
              onClick={() => {
                if (orderEntry.amount === 1) {
                  deleteOrder(orderEntry.positionId);
                } else {
                  updateOrder(orderEntry, orderEntry.amount - 1);
                }
              }}
            >
              <Minus className='w-4' />
            </button>
            <div className='w-10 text-center'>{orderEntry.amount}</div>
            <button
              type='button'
              aria-label='increase order count'
              className='px-1'
              onClick={() => {
                updateOrder(orderEntry, orderEntry.amount + 1);
              }}
            >
              <Plus className='w-4' />
            </button>
          </div>
        </div>
      </section>
      {isFormOpen ? (
        <MenuPositionForm
          description={position.description || ingredientsDescription}
          position={position}
          ingredients={positionIngredients}
          products={products}
          toppings={toppings}
          name={orderEntry.positionName}
          closeCallback={() => setIsFormOpen(false)}
        />
      ) : null}
    </section>
  );
}

export function Cart() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <section className='flex h-full w-full place-items-center justify-center border-t bg-white'>
        <div className='w-4/5 text-center'>
          <p className='mb-2 text-4xl font-medium'>В корзине пока пусто</p>
          <p className='text-1xl text-gray-500'>Вы ещё ничего не добавили</p>
        </div>
      </section>
    );
  }

  const orderPrice = orders.reduce(
    (price, order) => price + order.totalPrice,
    0
  );

  const orderItems = orders.map((orderEntry) => (
    <CartItem orderEntry={orderEntry} />
  ));

  return (
    <div className='h-full border-t bg-white'>
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
