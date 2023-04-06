import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { AnimatePresence, motion, useScroll } from 'framer-motion';

type MenuPositionModalProps = {
  closeCallback: () => void;
  renderMainContent: ReactNode;
  renderFooterContent: (close: () => void) => ReactNode;
};

export function MenuPositionModal({
  closeCallback,
  renderMainContent,
  renderFooterContent,
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

  return (
    <AnimatePresence onExitComplete={closeCallback}>
      {inState && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          data-testid='menu_position_modal'
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
                {renderMainContent}
              </section>
            </main>
            <footer className='fixed -bottom-2 flex h-min w-full justify-center bg-white/60 px-4 py-3 pb-5 backdrop-blur'>
              {renderFooterContent(() => {
                setInState(false);
              })}
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
