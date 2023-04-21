import { useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { motion, useScroll } from 'framer-motion';
import { ChevronLeft, X } from 'react-feather';
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
import { Modal } from 'components/Modal';
import { useOrders } from 'hooks/useOrders';
import { createPortal } from 'react-dom';

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

  // State of combo entries editing
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState<number>();

  const { addOrder } = useOrders();
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
        ingredients: defaultProductIngredients,
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
          description={defaultProductIngredients
            .map(({ ingredientName }) => ingredientName)
            .join(', ')}
          disabled={isExtraOpen && openProduct !== id}
          isExtraOpen={isExtraOpen && openProduct === id}
          isProductOpen={isProductOpen && openProduct === id}
          openExtra={() => {
            if (!isProductOpen || openProduct !== id) {
              setIsProductOpen(true);
              setOpenProduct(id);
            }
            setIsExtraOpen(true);
          }}
          toggleProduct={() => {
            setIsProductOpen(!(isProductOpen && openProduct === id));
            setOpenProduct(
              isProductOpen && openProduct === id ? undefined : id
            );
            if (isExtraOpen) {
              setIsExtraOpen(false);
            }
          }}
          productName={defaultProduct.productName}
          variationInfo={variationInfo}
          render={() => {
            if (isMobile) {
              return (
                <Modal>
                  <div className='fixed inset-0 z-20 bg-black/60 backdrop-blur-2xl '>
                    <Carousel initialId={productId} items={comboItems} />
                    <button
                      aria-label='Закрыть'
                      className='fixed top-2 right-2 z-50'
                      type='button'
                      onClick={() => {
                        setIsProductOpen(false);
                        setOpenProduct(undefined);
                      }}
                    >
                      <X className='h-8 w-8 text-white' />
                    </button>
                  </div>
                </Modal>
              );
            }

            return createPortal(
              <section className='relative grid h-full w-full rounded-l-3xl bg-white p-[1.875rem]'>
                <section className='grid w-full auto-rows-min grid-cols-3 gap-4'>
                  {byProductState.map(({ product, variation }) => {
                    // Find initial product variation to have persistent price difference
                    // no matter which product is actually selected
                    const initialCategoryMap = position.categoryMap.find(
                      (val) => val.id === id
                    );

                    if (!initialCategoryMap) {
                      return null;
                    }

                    const initialProduct =
                      positionProducts.entities[
                        initialCategoryMap.defaultProduct
                      ];
                    const cardProduct = positionProducts.entities[product];

                    if (!cardProduct || !initialProduct) {
                      return null;
                    }
                    const cardVariation = cardProduct.variations.find(
                      ({ id: variationId }) => variationId === variation
                    );
                    const initialVariation = initialProduct.variations[1];

                    if (!cardVariation || !initialVariation) {
                      return null;
                    }

                    const priceDifference =
                      cardVariation.price - initialVariation.price;

                    return (
                      <button
                        key={product}
                        type='button'
                        onClick={() =>
                          methods.setValue(
                            `categoryMaps.${index}.product`,
                            product
                          )
                        }
                        className={`${
                          defaultProduct.id === product
                            ? 'border-orange-600'
                            : 'border-transparent'
                        } flex flex-col place-items-center rounded-2xl border`}
                      >
                        <div
                          className={`${
                            defaultProduct.id === product
                              ? 'scale-90 hover:scale-[.85]'
                              : 'scale-100 hover:scale-95'
                          } aspect-square w-full rounded-full bg-orange-300 transition-transform `}
                        />
                        <p className='mt-2 font-bold'>
                          {cardProduct.productName}
                        </p>
                        {priceDifference !== 0 ? (
                          <p className='mt-1 mb-3 w-fit rounded-full bg-orange-100 px-2 text-sm font-medium tracking-tighter text-orange-600'>
                            {`${
                              priceDifference > 0 ? '+' : ''
                            }${priceDifference} ₽`}
                          </p>
                        ) : null}
                      </button>
                    );
                  })}
                </section>
                {isExtraOpen && (
                  <section className='absolute h-full w-full overflow-y-auto rounded-l-3xl bg-white p-6'>
                    <div className='flex place-items-center text-4xl tracking-tight'>
                      <button
                        type='button'
                        onClick={() => {
                          setIsExtraOpen(false);
                        }}
                        className='mr-6 rounded-full bg-white shadow-[rgba(0,0,0,0.12)_0px_0px_12px]'
                      >
                        <ChevronLeft className='h-12 w-12' />
                      </button>
                      <h2 className='font-bold'>Меняйте на свой вкус</h2>
                    </div>
                    <h3 className='my-4 text-xl font-bold'>Можно удалить</h3>
                    <IngredientsSection
                      onlyOptional
                      productId={productStateIndex}
                      fieldGroupId={index}
                      ingredients={defaultProductIngredients}
                    />
                    <hr className='mt-6' />
                    <ToppingsSection
                      productId={productStateIndex}
                      fieldGroupId={index}
                      toppings={defaultProductToppings}
                    />
                  </section>
                )}
              </section>,
              portalRootRef.current!
            );
          }}
        />
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
      isMobile={isMobile}
      closeCallback={closeCallback}
      renderContent={(closeModal) => (
        <FormProvider {...methods}>
          <form
            className='grid h-full md:grid-cols-[1.3fr_minmax(24rem,_1fr)]'
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
            <motion.div // Position image, fixed in background in mobile layout
              style={{ opacity: scrollYProgress }}
              className='fixed top-0 aspect-square w-full md:static md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2'
            >
              <div className='flex h-full w-full items-center justify-center rounded-full bg-orange-200 text-center'>
                {`Photo${scrollYProgress.get()}`}
              </div>
            </motion.div>
            <div
              className='col-start-1 col-end-2 row-start-1 row-end-2 hidden md:block'
              ref={portalRootRef}
            />
            <main
              ref={containerRef}
              className={`flex h-full w-full flex-col justify-between overflow-y-auto bg-white md:col-start-2 md:col-end-3 md:min-w-[24rem] md:rounded-r-3xl  ${
                isNotCombo ? 'md:bg-white' : 'md:bg-slate-100'
              }`}
            >
              <div className='z-10 md:hidden'>
                <div className='h-[50vw] w-full' />
                <div ref={targetRef} className='h-[50vw] w-full' />
              </div>
              <section className='bg-white/60 p-4 pt-7 backdrop-blur-xl md:bg-transparent md:px-6 md:backdrop-blur-none'>
                <h2 className='text-2xl font-semibold'>{name}</h2>
                {!isNotCombo && (
                  <span className='text-sm font-medium'>{description}</span>
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
