import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ children }: { children: ReactNode }) {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof window === 'object') {
      const classes = ['touch-none', 'overflow-hidden', 'overscroll-none'];
      document.body.classList.add(...classes);
      return () => {
        document.body.classList.remove(...classes);
      };
    }
  });
  if (typeof window !== 'object') return null;

  return createPortal(children, document.querySelector('#portal_root')!);
}
