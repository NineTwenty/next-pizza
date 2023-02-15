import type { Ingredient } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';

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
  ingredients,
  toppings,
  products,
}: MenuPositionModalProps) {
  const contentByCategory =
    position.categoryMap.length === 1 ? (
      <>
        {description}
        <h4 className='my-2'>Добавить по вкусу</h4>
        <ul className='grid grid-cols-3 gap-2'>
          {products.entities[
            position.categoryMap.reduce(
              (acc, { defaultProduct }) => defaultProduct,
              0
            )
          ]?.toppings
            .map((toppingId) => toppings.entities[toppingId])
            .map((topping) => {
              if (!topping) return null;
              return (
                <li
                  key={topping.id}
                  className='flex flex-col items-center rounded-xl bg-white p-2 shadow-xl'
                >
                  <div className='aspect-square w-full bg-amber-200' />
                  <span className='text-center text-xs'>
                    {topping.toppingName}
                  </span>
                  <span>{topping.price}</span>
                </li>
              );
            })}
        </ul>
      </>
    ) : (
      <>
        {description}
        <ul className='flex flex-col gap-4'>
          {position.categoryMap.map((categoryMap) => (
            <li
              key={categoryMap.id}
              className='flex rounded-xl bg-white p-4 shadow-md'
            >
              <div className='mr-4 flex aspect-square w-32 items-center justify-center rounded-full bg-orange-200 text-center'>
                {products.entities[categoryMap.defaultProduct]?.productName}
              </div>
              <section>
                <h3 className='font-medium'>
                  {products.entities[categoryMap.defaultProduct]?.productName}
                </h3>
                <button
                  type='button'
                  className='my-3 block h-8 w-fit min-w-[6rem] rounded-full bg-orange-100 text-sm leading-8 text-orange-700'
                >
                  Изменить
                </button>
              </section>
            </li>
          ))}
        </ul>
      </>
    );

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
                {`Photo${scrollYProgress.get()}`}{' '}
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
              <section className='bg-white/60 px-4 pt-4 backdrop-blur'>
                <h2 className='text-2xl'>{name}</h2>
                {contentByCategory}
              </section>
            </main>
            <footer className='fixed -bottom-2 flex h-min w-full justify-center bg-white/60 px-4 py-3 pb-5 backdrop-blur'>
              <button
                type='button'
                onClick={() => setInState(false)}
                className='h-12 w-full rounded-full bg-orange-600 text-white'
              >
                КОРЗИНА
              </button>
            </footer>
            <button
              type='button'
              onClick={() => setInState(false)}
              className='fixed top-0 z-10 m-4 rounded-full bg-white shadow'
            >
              <ChevronDown className='h-12 w-12' />
            </button>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
