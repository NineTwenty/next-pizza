import type { Ingredient, Topping } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';
import { usePositionForm } from 'hooks/usePositionForm';
import { ComboEntry } from 'components/ComboEntry';
import { FormProvider } from 'react-hook-form';
import { IngredientsSection } from 'components/IngredientsSection';
import { VariationsSection } from 'components/VariationsSection';
import { ToppingsSection } from 'components/ToppingsSection';
import { Carousel } from 'components/Carousel';
import { FlipCard } from 'components/FlipCard';
import { BackCardContent, FrontCardContent } from 'components/FlipCardContent';

type MenuPositionModalProps = {
  description: string;
  closeCallback: () => void;
  name: string;
  position: DenormalizedMenuPosition;
  ingredients: Ingredient[];
  toppings: ToppingState;
  products: ProductState;
};

export function MenuPositionModal({
  description,
  closeCallback,
  name,
  position,
  ingredients: positionIngredients,
  toppings: positionToppings,
  products: positionProducts,
}: MenuPositionModalProps) {
  // Animation related block
  const [inState, setInState] = useState(true);
  const containerRef = useRef(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
    offset: ['end start', 'start'],
  });

  useEffect(() => {
    if (inState) targetRef.current?.scrollIntoView(true);
  }, [inState]);

  // Form logic block
  const formId = `${position.id}_${position.categoryId}`;
  const { defaultFormValues: formValues, ...methods } = usePositionForm({
    categoryMaps: position.categoryMap,
    products: positionProducts,
  });
  const isNotCombo = formValues.length === 1;

  const contentByCategory = (
    <form
      id={formId}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={methods.handleSubmit((data) => console.log(data))}
    >
      {formValues.map(({ id, product: productId, byProductState }, index) => {
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
                const cardIngredients = positionIngredients.filter(
                  (ingredient) =>
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

        return isNotCombo ? (
          <>
            <div className='mb-1 text-sm text-gray-500'>{variationInfo}</div>
            <IngredientsSection
              productId={productId}
              fieldGroupId={index}
              ingredients={positionIngredients}
            />
            <VariationsSection
              productId={productId}
              fieldGroupId={index}
              variations={defaultProduct.variations}
            />
            <ToppingsSection
              productId={productId}
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
      })}
    </form>
  );

  return (
    <AnimatePresence onExitComplete={closeCallback}>
      {inState && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          onClick={(event) => event.stopPropagation()}
          className='fixed top-0 left-0 z-10 h-full w-full'
        >
          <motion.div // Fade background
            transition={{
              type: 'tween',
              ease: [0, 0, 0.25, 1],
              duration: 0.45,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute h-full w-full bg-black/60'
          />
          <motion.section // Main modal
            transition={{
              type: 'tween',
              ease: [0, 0, 0.25, 1],
              duration: 0.45,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className='relative top-0 h-full overflow-y-scroll overscroll-y-contain'
          >
            <motion.div // Position image, fixed in background in mobile layout
              style={{ opacity: scrollYProgress }}
              className='fixed top-0 aspect-square w-full bg-white'
            >
              <div className='flex h-full w-full items-center justify-center rounded-full bg-orange-200 text-center'>
                {`Photo${scrollYProgress.get()}`}
              </div>
            </motion.div>
            <main
              ref={containerRef}
              className='flex h-[101vh] flex-col justify-between overflow-y-auto overscroll-y-contain bg-white pb-24'
            >
              <div className='z-10'>
                <div className='h-[50vw] w-full' />
                <div ref={targetRef} className='h-[50vw] w-full' />
              </div>
              <section className='bg-white/60 px-4 pt-4 backdrop-blur-xl'>
                <FormProvider {...methods}>
                  <h2 className='text-2xl'>{name}</h2>
                  {!isNotCombo && <span>{description}</span>}
                  {contentByCategory}
                </FormProvider>
              </section>
            </main>
            <footer className='fixed -bottom-2 flex h-min w-full justify-center bg-white/60 px-4 py-3 pb-5 backdrop-blur'>
              <button
                type='submit'
                form={formId}
                onClick={() => {
                  setInState(false);
                }}
                className='h-12 w-full rounded-full bg-orange-600 text-white'
              >
                КОРЗИНА
              </button>
            </footer>
            <button
              type='button'
              onClick={() => {
                setInState(false);
              }}
              className='fixed top-0 z-10 m-4 rounded-full bg-white shadow-[rgba(0,0,0,0.12)_0px_0px_12px]'
            >
              <ChevronDown className='h-12 w-12' />
            </button>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
