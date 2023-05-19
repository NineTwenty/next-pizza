import type { RefObject } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft } from 'react-feather';
import Image from 'next/image';
import type { DenormalizedMenuPosition } from 'types/server';
import type { PositionState } from 'hooks/usePositionForm';
import { usePositionFormContext } from 'hooks/usePositionForm';
import { useMenuPositions } from 'utils/apiHooks';
import { getEntities } from 'utils/common';
import { Carousel } from 'components/Carousel';
import { ComboEntry } from 'components/ComboEntry';
import { FlipCard } from 'components/FlipCard';
import { BackCardContent, FrontCardContent } from 'components/FlipCardContent';
import { IngredientsSection } from 'components/IngredientsSection';
import { Modal } from 'components/Modal';
import { ToppingsSection } from 'components/ToppingsSection';
import pizzaPic from 'assets/pizza-icon.svg';

type ComboContentProps = {
  position: DenormalizedMenuPosition;
  positionStates: PositionState[];
  isMobile: boolean;
  portalRootRef: RefObject<HTMLElement>;
};

export function ComboContent({
  position,
  positionStates,
  isMobile,
  portalRootRef,
}: ComboContentProps) {
  const { data } = useMenuPositions({ category: position.categoryId });
  const formMethods = usePositionFormContext();

  // State of combo entries editing
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState<number>();

  if (!data) return null;

  const content = positionStates.map(
    (
      { id: positionStateId, byProductState, product: productId },
      positionStateIndex
    ) => {
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
      } = getEntities(productId, defaultProductState, {
        products: data.products,
        ingredients: data.ingredients,
        toppings: data.toppings,
      });

      const variationInfo = `${defaultVariation?.size}, ${defaultVariation?.weight}`;

      const comboItems = byProductState.map(
        (productState, productStateIndex) => {
          const { product: cardProductId } = productState;
          const {
            product: cardProduct,
            ingredients: cardIngredients,
            toppings: cardToppings,
            variation: cardVariation,
          } = getEntities(productState.product, productState, {
            products: data.products,
            ingredients: data.ingredients,
            toppings: data.toppings,
          });

          const cardVariationInfo = `${cardVariation.size}, ${cardVariation.weight}`;
          const priceDifference = cardVariation.price - defaultVariation.price;

          return {
            id: cardProductId,
            content: (
              <FlipCard
                key={cardProductId}
                renderFrontContent={({ flip }) => (
                  <FrontCardContent
                    fieldGroupId={positionStateIndex}
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
                    fieldGroupId={positionStateIndex}
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
      );

      const productStateIndex = byProductState.findIndex(
        (product) => product === defaultProductState
      );

      return (
        <ComboEntry
          key={positionStateId}
          description={defaultProductIngredients
            .map(({ ingredientName }) => ingredientName)
            .join(', ')}
          disabled={isExtraOpen && openProduct !== positionStateId}
          isExtraOpen={isExtraOpen && openProduct === positionStateId}
          isProductOpen={isProductOpen && openProduct === positionStateId}
          openExtra={() => {
            if (!isProductOpen || openProduct !== positionStateId) {
              setIsProductOpen(true);
              setOpenProduct(positionStateId);
            }
            setIsExtraOpen(true);
          }}
          toggleProduct={() => {
            setIsProductOpen(
              !(isProductOpen && openProduct === positionStateId)
            );
            setOpenProduct(
              isProductOpen && openProduct === positionStateId
                ? undefined
                : positionStateId
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
                      className='fixed right-2 top-2 z-50'
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
                      (val) => val.id === positionStateId
                    );

                    if (!initialCategoryMap) {
                      return null;
                    }

                    const initialProduct =
                      data.products.entities[initialCategoryMap.defaultProduct];
                    const cardProduct = data.products.entities[product];

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
                          formMethods.setValue(
                            `categoryMaps.${positionStateIndex}.product`,
                            product
                          )
                        }
                        className={`${
                          defaultProduct.id === product
                            ? 'border-orange-600'
                            : 'border-transparent'
                        } flex flex-col place-items-center rounded-2xl border`}
                      >
                        <div className='w-full'>
                          <Image
                            className={`${
                              defaultProduct.id === product
                                ? 'scale-90 hover:scale-[.85]'
                                : 'scale-100 hover:scale-95'
                            } transition-transform`}
                            alt=''
                            src={pizzaPic as string}
                          />
                        </div>
                        <p className='mt-2 font-bold'>
                          {cardProduct.productName}
                        </p>
                        {priceDifference !== 0 ? (
                          <p className='mb-3 mt-1 w-fit rounded-full bg-orange-100 px-2 text-sm font-medium tracking-tighter text-orange-600'>
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
                      fieldGroupId={positionStateIndex}
                      ingredients={defaultProductIngredients}
                    />
                    <hr className='mt-6' />
                    <ToppingsSection
                      productId={productStateIndex}
                      fieldGroupId={positionStateIndex}
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

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{content}</>;
}
