import type { ReactNode } from 'react';
import { useState } from 'react';
import styles from 'styles/FlipCard.module.css';

type FlipCardProps = {
  renderFrontContent: ({ flip }: { flip: () => void }) => ReactNode;
  renderBackContent: ({ flip }: { flip: () => void }) => ReactNode;
};

export function FlipCard({
  renderFrontContent,
  renderBackContent,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = () => setIsFlipped((val) => !val);
  return (
    <div className='h-full w-full rounded-3xl'>
      <div
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        className={`${styles.card__content} ${isFlipped ? styles.flip : ''}`}
      >
        <div className={styles.front}>{renderFrontContent({ flip })}</div>
        <div className={styles.back}>{renderBackContent({ flip })}</div>
      </div>
    </div>
  );
}
