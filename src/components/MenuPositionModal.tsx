import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'react-feather';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { Modal } from 'components/Modal';

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
        <Modal>
          <div
            data-testid='menu_position_modal'
            onClick={(event) => event.stopPropagation()}
            className='fixed top-0 left-0 z-10 h-full w-full place-items-center justify-center md:flex'
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
              className='relative top-0 h-full overflow-hidden md:flex md:h-[38rem] md:w-[60rem] md:overflow-visible md:rounded-3xl md:bg-white'
            >
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
                  {renderMainContent}
                </section>
                <footer className='sticky bottom-0 flex h-min w-full justify-center bg-white/60 px-4 py-3 backdrop-blur md:bg-stone-50 md:p-[1.5rem_1.875rem_1.875rem] md:backdrop-blur-none'>
                  {renderFooterContent(() => {
                    setInState(false);
                  })}
                </footer>
              </main>
              <button
                type='button'
                onClick={() => {
                  setInState(false);
                }}
                className='fixed top-0 z-10 m-4 rounded-full bg-white shadow-[rgba(0,0,0,0.12)_0px_0px_12px] md:-right-16 md:-top-3 md:bg-transparent md:shadow-none'
              >
                <X className='hidden h-11 w-11 stroke-white md:block' />
                <ChevronDown className='h-12 w-12 md:hidden' />
              </button>
            </motion.section>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
