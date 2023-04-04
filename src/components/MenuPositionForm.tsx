import { FormProvider } from 'react-hook-form';
import type { Ingredient, Topping } from '@prisma/client';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';
import { FlipCard } from 'components/FlipCard';
import { BackCardContent, FrontCardContent } from 'components/FlipCardContent';
import { MenuPositionModal } from 'components/MenuPositionModal';
import { usePositionForm } from 'hooks/usePositionForm';
import { IngredientsSection } from 'components/IngredientsSection';
import { VariationsSection } from 'components/VariationsSection';
import { ToppingsSection } from 'components/ToppingsSection';
import { ComboEntry } from 'components/ComboEntry';
import { Carousel } from 'components/Carousel';
import { useOrders } from 'hooks/useOrders';

type MenuPositionFormProps = {
  closeCallback: () => void;
  description: string;
  name: string;
  position: DenormalizedMenuPosition;
  ingredients: Ingredient[];
  toppings: ToppingState;
  products: ProductState;
};

export function MenuPositionForm({
  closeCallback,
  description,
  name,
  position,
  ingredients: positionIngredients,
  toppings: positionToppings,
  products: positionProducts,
}: MenuPositionFormProps) {
  const { addOrder } = useOrders();
  const formId = `${position.id}_${position.categoryId}`;
  const { defaultFormValues: formValues, ...methods } = usePositionForm({
    categoryMaps: position.categoryMap,
    products: positionProducts,
  });
  const isNotCombo = formValues.length === 1;

  const contentByCategory = formValues.map(
    ({ id, product: productId, byProductState }, index) => {
      const defaultProduct = positionProducts.entities[productId];
      const defaultProductState = byProductState.find(
        ({ product }) => product === productId
      );

      if (!defaultProduct || !defaultProductState) return null;
      const defaultVariation = defaultProduct.variations.find(
        (productVariation) =>
          productVariation.id === defaultProductState.variation
      );
      const defaultProductToppings = defaultProduct.toppings
        .map((toppingId) => positionToppings.entities[toppingId])
        .filter((topping): topping is Topping => !!topping);

      if (!defaultVariation) return null;
      const variationInfo = `${defaultVariation?.size}, ${defaultVariation?.weight}`;

      const comboItems = !isNotCombo
        ? byProductState.map(
            ({ product: cardProductId, variation }, productStateIndex) => {
              const cardProduct = positionProducts.entities[cardProductId];

              if (!cardProduct) {
                throw new Error('Missing entity');
              }

              const cardToppings = cardProduct.toppings
                .map((toppingId) => positionToppings.entities[toppingId])
                .filter((topping): topping is Topping => !!topping);
              const cardIngredients = positionIngredients.filter((ingredient) =>
                cardProduct.ingredients.includes(ingredient.id)
              );

              const cardVariation = cardProduct.variations.find(
                (productVariation) => productVariation.id === variation
              );
              if (!cardVariation) {
                throw new Error('Missing entity');
              }

              const cardVariationInfo = `${cardVariation.size}, ${cardVariation.weight}`;
              const priceDifference =
                cardVariation.price - defaultVariation.price;

              return {
                id: cardProductId,
                content: (
                  <FlipCard
                    key={cardProductId}
                    renderFrontContent={({ flip }) => (
                      <FrontCardContent
                        fieldGroupId={index}
                        productFieldIndex={productStateIndex}
                        productId={cardProductId}
                        productName={cardProduct.productName}
                        priceDifference={priceDifference}
                        variationInfo={cardVariationInfo}
                        ingredients={cardIngredients}
                        toppings={cardToppings}
                        flip={flip}
                      />
                    )}
                    renderBackContent={({ flip }) => (
                      <BackCardContent
                        fieldGroupId={index}
                        productFieldIndex={productStateIndex}
                        ingredients={cardIngredients}
                        toppings={cardToppings}
                        flip={flip}
                      />
                    )}
                  />
                ),
              };
            }
          )
        : [];

      const productStateIndex = byProductState.findIndex(
        (product) => product === defaultProductState
      );

      return isNotCombo ? (
        <>
          <div className='mb-1 text-sm text-gray-500'>{variationInfo}</div>
          <IngredientsSection
            productId={productStateIndex}
            fieldGroupId={index}
            ingredients={positionIngredients}
          />
          <VariationsSection
            productId={productStateIndex}
            fieldGroupId={index}
            variations={defaultProduct.variations}
          />
          <ToppingsSection
            productId={productStateIndex}
            fieldGroupId={index}
            toppings={defaultProductToppings}
          />
        </>
      ) : (
        <ComboEntry
          key={id}
          productName={defaultProduct.productName}
          variationInfo={variationInfo}
        >
          <Carousel initialId={productId} items={comboItems} />
        </ComboEntry>
      );
    }
  );

  const categoryMapsFormValues = methods.watch('categoryMaps');
  const totalPrice = categoryMapsFormValues.reduce(
    (comboPrice, { product: productId, byProductState }) => {
      const defaultProduct = positionProducts.entities[productId];
      const defaultProductState = byProductState.find(
        ({ product }) => product === productId
      );

      if (!defaultProduct || !defaultProductState) {
        throw new Error(
          `Required entity is missing, cannot calculate total position price`
        );
      }
      const defaultVariation = defaultProduct.variations.find(
        (productVariation) =>
          productVariation.id === defaultProductState.variation
      );

      if (!defaultVariation) {
        throw new Error(
          `Required entity is missing, cannot calculate total position price`
        );
      }

      const productToppingsPrice = defaultProductState.includedToppings
        .map(
          (toppingId) =>
            positionToppings.entities[parseInt(`${toppingId}`, 10)]?.price ?? 0
        )
        .reduce((toppingsPrice, price) => {
          if (toppingsPrice >= 0 && price) {
            return toppingsPrice + price;
          }
          return 0;
        }, 0);

      return comboPrice + defaultVariation.price + productToppingsPrice;
    },
    0
  );

  return (
    <MenuPositionModal
      closeCallback={closeCallback}
      renderMainContent={
        <FormProvider {...methods}>
          <h2 className='text-2xl'>{name}</h2>
          {!isNotCombo && <span>{description}</span>}
          <form
            id={formId}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={methods.handleSubmit(({ categoryMaps }) =>
              addOrder({
                order: categoryMaps,
                categoryId: position.categoryId,
                positionId: position.id,
                positionName: position.menuPositionName,
                totalPrice,
              })
            )}
          >
            {contentByCategory}
          </form>
        </FormProvider>
      }
      renderFooterContent={(close) => (
        <button
          type='submit'
          form={formId}
          onClick={close}
          className='h-12 w-full rounded-full bg-orange-600 tracking-tight text-white'
        >
          Добавить в корзину за {totalPrice} ₽
        </button>
      )}
    />
  );
}
