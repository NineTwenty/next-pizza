import type { Ingredient } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';
import { PizzaForm } from 'components/PizzaForm';
import { ComboForm } from 'components/ComboForm';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

type MenuPositionModalProps = {
  description: string;
  closeCallback: () => void;
  name: string;
  position: DenormalizedMenuPosition;
  ingredients: Ingredient[];
  toppings: ToppingState;
  products: ProductState;
};

export type PositionFormState = {
  id: number;
  product: number;
  includedToppings: number[];
  excludedIngredients: number[];
  variation: number;
};

export function MenuPositionModal({
  description,
  closeCallback,
  name,
  position,
  ingredients,
  toppings,
  products,
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
  // Default form state for all included positions
  const [categoryMapState, setCategoryMapState] = useState<
    Record<number, PositionFormState>
  >(
    position.categoryMap
      .map((categoryMap) => {
        const defaultProduct = products.entities[categoryMap.defaultProduct];

        if (!defaultProduct) {
          throw new Error('Attempt to access missing default product');
        }

        return {
          id: categoryMap.id,
          product: defaultProduct.id,
          includedToppings: [],
          excludedIngredients: [],
          variation: defaultProduct.variations.length > 1 ? 1 : 0,
        };
      })
      .reduce(
        (map, categoryMap) => ({ ...map, [categoryMap.id]: categoryMap }),
        {}
      )
  );

  const isNotCombo = position.categoryMap.length === 1;

  const formId = `${position.id}_${position.categoryId}`;
  const methods = useForm({
    defaultValues: categoryMapState,
  });

  const contentByCategory = isNotCombo ? (
    Object.values(categoryMapState).map(({ id }) => (
      <PizzaForm
        key={id}
        fieldGroupId={id}
        ingredients={ingredients}
        products={products}
        toppings={toppings}
        formId={formId}
      />
    ))
  ) : (
    <ComboForm
      description={description}
      position={position}
      products={products}
    />
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
