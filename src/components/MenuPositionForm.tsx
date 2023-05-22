import { Fragment, useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { motion, useScroll } from 'framer-motion';
import type { Ingredient } from '@prisma/client';
import Image from 'next/image';
import type { ProductState, ToppingState } from 'types/client';
import type { NormalizedMenuPosition } from 'types/server';
import { MenuPositionModal } from 'components/MenuPositionModal';
import type { PositionState } from 'hooks/usePositionForm';
import { usePositionForm } from 'hooks/usePositionForm';
import { IngredientsSection } from 'components/IngredientsSection';
import { VariationsSection } from 'components/VariationsSection';
import { ToppingsSection } from 'components/ToppingsSection';
import { ComboContent } from 'components/ComboContent';
import { useOrders } from 'hooks/useOrders';
import { getEntities } from 'utils/common';
import pizzaPic from 'assets/pizza-icon.svg';

type MenuPositionFormProps = {
  closeCallback: () => void;
  name: string;
  position: NormalizedMenuPosition;
  ingredients: Ingredient[];
  toppings: ToppingState;
  products: ProductState;
  orders?: PositionState[];
};

export function MenuPositionForm({
  closeCallback,
  name,
  position,
  ingredients: positionIngredients,
  toppings: positionToppings,
  products: positionProducts,
  orders,
}: MenuPositionFormProps) {
  const portalRootRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const resizeObserverRef = useRef(
    new ResizeObserver((entries) => {
      for (const entry of entries) {
        const bodyWidth = entry.borderBoxSize[0]?.inlineSize;
        if (bodyWidth && bodyWidth < 768) {
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
      }
    })
  );

  useEffect(() => {
    const observer = resizeObserverRef.current;
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);

  const { upsertOrder } = useOrders();
  const { defaultFormValues: formValues, ...methods } = usePositionForm({
    categoryMaps: position.categoryMap,
    products: positionProducts,
    orders,
  });
  const isNotCombo = formValues.length === 1;

  const contentByCategory = isNotCombo ? (
    formValues.map(({ id, product: productId, byProductState }, index) => {
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
      } = getEntities(productId, defaultProductState, {
        products: positionProducts,
        ingredients: positionIngredients,
        toppings: positionToppings,
      });

      const variationInfo = `${defaultVariation?.size}, ${defaultVariation?.weight}`;

      const productStateIndex = byProductState.findIndex(
        (product) => product === defaultProductState
      );

      return (
        <Fragment key={id}>
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
        </Fragment>
      );
    })
  ) : (
    <ComboContent
      position={position}
      positionStates={formValues}
      isMobile={isMobile}
      portalRootRef={portalRootRef}
    />
  );

  const categoryMapsFormValues = methods.watch('categoryMaps');
  const totalPrice = categoryMapsFormValues.reduce(
    (comboPrice, { product: productId, byProductState }) => {
      const defaultProductState = byProductState.find(
        ({ product }) => product === productId
      );

      if (!defaultProductState) {
        throw new Error(
          `Required entity is missing, cannot calculate total position price`
        );
      }

      const { variation: defaultVariation } = getEntities(
        productId,
        defaultProductState,
        {
          ingredients: positionIngredients,
          toppings: positionToppings,
          products: positionProducts,
        }
      );

      const productToppingsPrice = defaultProductState.includedToppings.reduce(
        (toppingsPrice, toppingId) => {
          const topping =
            positionToppings.entities[parseInt(`${toppingId}`, 10)];
          if (topping) {
            return toppingsPrice + topping.price;
          }
          return toppingsPrice;
        },
        0
      );

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
      isMobile={isMobile}
      closeCallback={closeCallback}
      renderContent={(closeModal) => (
        <FormProvider {...methods}>
          <form
            className='grid h-full overflow-hidden bg-white md:grid-cols-[1.3fr_minmax(24rem,_1fr)] md:grid-rows-1 md:rounded-3xl'
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={methods.handleSubmit(({ categoryMaps }) =>
              upsertOrder({
                order: categoryMaps,
                categoryId: position.categoryId,
                positionId: position.id,
                positionName: position.menuPositionName,
                totalPrice,
              })
            )}
          >
            <motion.div // Position image, fixed in background in mobile layout
              style={{ opacity: scrollYProgress }}
              className='fixed top-0 flex aspect-square w-full place-items-center justify-center md:static md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 md:h-full md:p-10'
            >
              <Image
                className='w-full opacity-[inherit]'
                alt=''
                src={pizzaPic as string}
              />
            </motion.div>
            <div
              className='col-start-1 col-end-2 row-start-1 row-end-2 hidden md:block'
              ref={portalRootRef}
            />
            <main
              ref={containerRef}
              className={`flex h-full w-full flex-col justify-between overflow-y-scroll bg-white md:col-start-2 md:col-end-3 md:min-w-[24rem] md:overflow-auto ${
                isNotCombo ? 'md:bg-white' : 'md:bg-slate-100'
              }`}
            >
              <div className='z-10 md:hidden'>
                <div className='h-[50vw] w-full' />
                <div ref={targetRef} className='h-[50vw] w-full' />
              </div>
              <section className='bg-white/60 p-4 pt-7 backdrop-blur-xl md:mt-7 md:overflow-y-scroll md:bg-transparent md:px-6 md:pt-0 md:backdrop-blur-none'>
                <h2 className='text-2xl font-semibold'>{name}</h2>
                {!isNotCombo && (
                  <span className='text-sm font-medium'>
                    {position.description}
                  </span>
                )}
                {contentByCategory}
              </section>
              <footer className='sticky bottom-0 flex h-min w-full justify-center bg-white/60 px-4 py-3 backdrop-blur md:bg-stone-50 md:p-[1.5rem_1.875rem_1.875rem] md:backdrop-blur-none'>
                <button
                  type='submit'
                  onClick={closeModal}
                  className='h-12 w-full rounded-full bg-orange-600 font-medium tracking-tight text-white'
                >
                  Добавить в корзину за {totalPrice} ₽
                </button>
              </footer>
            </main>
          </form>
        </FormProvider>
      )}
    />
  );
}
