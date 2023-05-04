import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown, X } from 'react-feather';
import type { Transition, Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from 'components/Modal';

type MenuPositionModalProps = {
  closeCallback: () => void;
  renderContent: (close: () => void) => ReactNode;
  isMobile: boolean;
};

const mobileTransition: Transition = {
  type: 'tween',
  delay: 0.1,
  ease: [0, 0, 0.25, 1],
  duration: 0.45,
};

const desktopTransition: Transition = {
  type: 'tween',
  delay: 0.1,
  duration: 0.15,
};

const mobileVariant = {
  hidden: {
    y: '100%',
  },
  visible: {
    y: 0,
  },
} satisfies Variants;

const desktopVariant = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
} satisfies Variants;

export function MenuPositionModal({
  closeCallback,
  renderContent,
  isMobile,
}: MenuPositionModalProps) {
  const [inState, setInState] = useState(true);

  const variant = isMobile ? mobileVariant : desktopVariant;
  const transtition = isMobile ? mobileTransition : desktopTransition;
  // Force remount by key change to update variant & transition

  return (
    <AnimatePresence onExitComplete={closeCallback}>
      {inState && (
        <Modal>
          <div
            data-testid='menu_position_modal'
            className='fixed left-0 top-0 z-10 h-full w-full place-items-center justify-center md:flex'
          >
            <motion.button // Fade background
              onClick={() => {
                setInState(false);
              }}
              transition={transtition}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute h-full w-full cursor-default bg-black/60'
            />
            <motion.section // Main modal
              variants={variant}
              transition={transtition}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='relative top-0 h-full md:h-[38rem] md:w-[60rem] md:max-w-[80%]'
            >
              {renderContent(() => setInState(false))}
              <button
                type='button'
                onClick={() => {
                  setInState(false);
                }}
                className='fixed top-0 z-10 m-4 rounded-full bg-white shadow-[rgba(0,0,0,0.12)_0px_0px_12px] md:relative md:-top-[102%] md:ml-[100.5%] md:bg-transparent md:shadow-none'
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
