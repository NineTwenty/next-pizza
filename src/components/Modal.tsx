import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ children }: { children: ReactNode }) {
  if (typeof window !== 'object') return null;

  return createPortal(children, document.querySelector('#portal_root')!);
}
