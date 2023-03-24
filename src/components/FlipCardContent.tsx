import type { Ingredient, Topping } from '@prisma/client';
import { X } from 'react-feather';
import { Controller } from 'react-hook-form';
import { usePositionFormContext } from 'hooks/usePositionForm';
import { IngredientsSection } from 'components/IngredientsSection';
import { ToppingsSection } from 'components/ToppingsSection';

export function FrontCardContent({
  fieldGroupId,
  productFieldIndex,
  productId,
  productName,
  priceDifference,
  variationInfo,
  ingredients,
  toppings,
  flip,
}: {
  fieldGroupId: number;
  productFieldIndex: number;
  productId: number;
  productName: string;
  priceDifference: number;
  variationInfo: string;
  ingredients: Ingredient[];
  toppings: Topping[];
  flip: () => void;
}) {
  const { control, watch } = usePositionFormContext();

  const excludedIngredients = watch(
    `categoryMaps.${fieldGroupId}.byProductState.${productFieldIndex}.excludedIngredients`
  );
  const includedToppings = watch(
    `categoryMaps.${fieldGroupId}.byProductState.${productFieldIndex}.includedToppings`
  );

  return (
    <div
      key={productName}
      className='overflow-y-scroll-scroll flex h-full w-full flex-col items-center rounded-3xl bg-white p-4'
    >
      <div className='mx-auto my-3 h-40 w-40 rounded-full bg-pink-400' />
      <h3 className='text-lg font-semibold'>{productName}</h3>
      <p className='text-xs'>{variationInfo}</p>
      <section className='flex flex-wrap justify-center text-xs text-gray-600'>
        {ingredients.map(({ id, ingredientName }, index) => (
          <>
            <span
              className={`${
                excludedIngredients.includes(`${id}`) ? 'line-through' : ''
              } first:first-letter:uppercase`}
            >
              {ingredientName}
            </span>
            {index < ingredients.length - 1 ? (
              <span className='mr-1'>,</span>
            ) : null}
          </>
        ))}
      </section>
      <section className='mb-3 flex flex-wrap justify-center text-xs lowercase'>
        {includedToppings
          .map(
            (id) =>
              `+${
                toppings.find((topping) => topping.id === parseInt(id, 10))
                  ?.toppingName
              }`
          )
          .join(' ')}
      </section>
      <button
        type='button'
        className='rounded-full bg-orange-100 p-2 px-4 text-sm text-orange-600'
        onClick={flip}
      >
        Изменить состав
      </button>
      <Controller
        control={control}
        name={`categoryMaps.${fieldGroupId}.product`}
        render={({ field }) => {
          const isChecked = field.value === productId;
          return (
            <footer className='mt-auto flex w-full items-center justify-between'>
              {isChecked || priceDifference === 0 ? null : (
                <p className='text-xl font-medium'>
                  {priceDifference > 0
                    ? `+${priceDifference}`
                    : priceDifference}
                  ₽
                </p>
              )}
              <button
                type='button'
                onClick={() => field.onChange(productId)}
                className={`${
                  isChecked
                    ? 'w-full bg-orange-100 text-orange-600'
                    : 'w-[62%] bg-orange-600 text-white'
                } mt-auto block h-12 cursor-pointer rounded-full p-2 px-5 text-center text-base`}
              >
                {isChecked ? 'Уже в комбо' : 'Выбрать'}
              </button>
            </footer>
          );
        }}
      />
    </div>
  );
}

export function BackCardContent({
  fieldGroupId,
  productFieldIndex,
  ingredients,
  toppings,
  flip,
}: {
  fieldGroupId: number;
  productFieldIndex: number;
  ingredients: Ingredient[];
  toppings: Topping[];
  flip: () => void;
}) {
  return (
    <div className='flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white'>
      <div className='overflow-y-auto py-4'>
        <div className='px-4'>
          <h4 className='mb-4 text-lg font-medium'>Можно удалить</h4>
          <IngredientsSection
            onlyOptional
            productId={productFieldIndex}
            fieldGroupId={fieldGroupId}
            ingredients={ingredients}
          />
        </div>
        <ToppingsSection
          type='column'
          productId={productFieldIndex}
          fieldGroupId={fieldGroupId}
          toppings={toppings}
        />
      </div>
      <div className='flex w-full gap-3 p-4'>
        <button
          type='button'
          className='rounded-full bg-gray-100 p-3'
          onClick={flip}
        >
          <X className='mx-auto' />
        </button>
        <button
          type='button'
          onClick={flip}
          className='w-full rounded-full bg-orange-500 px-4 text-white'
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
