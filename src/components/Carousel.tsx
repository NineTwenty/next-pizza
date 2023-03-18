import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';

export function Carousel({
  items,
  initialId,
}: {
  items: { id: number; content: ReactNode }[];
  initialId: number;
}) {
  const itemsRef = useRef(new Map<number, HTMLDivElement>());
  const [activeIndex, setActiveIndex] = useState(
    items.findIndex(({ id }) => id === initialId)
  );
  const [observer] = useState(
    new IntersectionObserver(
      (entries) => {
        entries.forEach(({ intersectionRatio, isIntersecting, target }) => {
          if (
            isIntersecting &&
            intersectionRatio === 1 &&
            target instanceof HTMLElement &&
            'carouselid' in target.dataset
          ) {
            const carouselId = target.dataset.carouselid;
            if (carouselId) {
              setActiveIndex(
                items.findIndex(({ id }) => id === parseInt(carouselId, 10))
              );
            }
          }
        });
      },
      { threshold: 1 }
    )
  );

  function getMap() {
    return itemsRef.current;
  }

  useEffect(() => {
    const itemsMap = getMap();
    const activeItem = itemsMap.get(initialId);

    if (activeItem) {
      activeItem.scrollIntoView({
        inline: 'center',
      });
      activeItem.parentElement?.focus();
    }

    for (const node of itemsMap.values()) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [initialId, observer]);

  const itemPagination = `${activeIndex + 1} / ${items.length}`;

  return (
    <div className='h-full w-full'>
      <div className='absolute w-full pt-12 text-center text-xl font-medium text-white'>
        {itemPagination}
      </div>
      <div className='flex h-full w-full snap-x snap-mandatory snap-always items-center gap-6 overflow-x-auto px-12'>
        {items.map(({ id, content }) => (
          <div
            ref={(node) => {
              const map = getMap();
              if (node) {
                map.set(id, node);
              } else {
                map.delete(id);
              }
            }}
            data-carouselid={`${id.toString()}`}
            key={id}
            className='h-[77.6vh] w-[77.6vw] flex-shrink-0 snap-center'
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
