import { useEffect, useRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { motion, useScroll } from 'framer-motion';
import type { Ingredient, Topping } from '@prisma/client';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';
import { FlipCard } from 'components/FlipCard';
import { BackCardContent, FrontCardContent } from 'components/FlipCardContent';
import { MenuPositionModal } from 'components/MenuPositionModal';
import type { PositionProductState } from 'hooks/usePositionForm';
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
      function getEntities(
        targetProductId: number,
        targetProductState: PositionProductState
      ) {
        const product = positionProducts.entities[targetProductId];

        if (!product) throw new Error('Missing entity');
        const variation = product.variations.find(
          (productVariation) =>
            productVariation.id === targetProductState.variation
        );
        const ingredients = positionIngredients.filter((ingredient) =>
          product.ingredients.includes(ingredient.id)
        );
        const toppings = product.toppings
          .map((toppingId) => positionToppings.entities[toppingId])
          .filter((topping): topping is Topping => !!topping);

        if (!variation) throw new Error('Missing entity');
        return {
          product,
          variation,
          ingredients,
          toppings,
        };
      }

      const defaultProductState = byProductState.find(
        (state) => state.product === productId
      );

      if (!defaultProductState) {
        return null;
      }

      const {
        product: defaultProduct,
        toppings: defaultProductToppings,
        variation: defaultVariation,
      } = getEntities(productId, defaultProductState);

      const variationInfo = `${defaultVariation?.size}, ${defaultVariation?.weight}`;

      const comboItems = !isNotCombo
        ? byProductState.map((productState, productStateIndex) => {
            const { product: cardProductId } = productState;
            const {
              product: cardProduct,
              ingredients: cardIngredients,
              toppings: cardToppings,
              variation: cardVariation,
            } = getEntities(productState.product, productState);

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
          })
        : [];

      const productStateIndex = byProductState.findIndex(
        (product) => product === defaultProductState
      );

      return isNotCombo ? (
        <>
          <div className='mb-1 text-sm font-medium text-gray-500'>
            {variationInfo}
          </div>
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

  // Animation related block
  const containerRef = useRef(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
    offset: ['end start', 'start'],
  });

  useEffect(() => {
    targetRef.current?.scrollIntoView(true);
  }, []);

  return (
    <MenuPositionModal
      closeCallback={closeCallback}
      renderContent={(closeModal) => (
        <FormProvider {...methods}>
          <motion.div // Position image, fixed in background in mobile layout
            style={{ opacity: scrollYProgress }}
            className='fixed top-0 aspect-square w-full md:static'
          >
            <div className='flex h-full w-full items-center justify-center rounded-full bg-orange-200 text-center'>
              {`Photo${scrollYProgress.get()}`}
            </div>
          </motion.div>
          <main
            ref={containerRef}
            className='flex h-full flex-col justify-between overflow-y-auto bg-white md:min-w-[24rem] md:rounded-r-3xl md:bg-stone-50'
          >
            <div className='z-10 md:hidden'>
              <div className='h-[50vw] w-full' />
              <div ref={targetRef} className='h-[50vw] w-full' />
            </div>
            <section className='bg-white/60 p-4 pt-7 backdrop-blur-xl md:px-[1.875rem]'>
              <h2 className='text-2xl font-semibold'>{name}</h2>
              {!isNotCombo && (
                <span className='font-medium'>{description}</span>
              )}
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
            </section>
            <footer className='sticky bottom-0 flex h-min w-full justify-center bg-white/60 px-4 py-3 backdrop-blur md:bg-stone-50 md:p-[1.5rem_1.875rem_1.875rem] md:backdrop-blur-none'>
              <button
                type='submit'
                form={formId}
                onClick={closeModal}
                className='h-12 w-full rounded-full bg-orange-600 font-medium tracking-tight text-white'
              >
                Добавить в корзину за {totalPrice} ₽
              </button>
            </footer>
          </main>
        </FormProvider>
      )}
    />
  );
}
