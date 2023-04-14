import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown, X } from 'react-feather';
import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from 'components/Modal';

type MenuPositionModalProps = {
  closeCallback: () => void;
  renderContent: (close: () => void) => ReactNode;
};

export function MenuPositionModal({
  closeCallback,
  renderContent,
}: MenuPositionModalProps) {
  const [inState, setInState] = useState(true);

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
              {renderContent(() => setInState(false))}
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
