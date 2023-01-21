import { useEffect, useRef } from 'react';
import { useMenuPositions } from 'utils/apiHooks';

type CategoryProps = {
  id: number;
  title: string;
  setActiveCategory: (category: string) => void;
};

export function CategoryEntry({ title, id, setActiveCategory }: CategoryProps) {
  const { isSuccess, data } = useMenuPositions({ category: id });
  const sectionRef = useRef<HTMLDivElement>(null);

  // Update active category as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // TODO: Test if it's trigger as intended
        entries.forEach(({ intersectionRatio, isIntersecting }) => {
          if (
            // On scroll down
            (intersectionRatio < 1 && !isIntersecting) ||
            // On scroll up
            (intersectionRatio === 1 && isIntersecting)
          )
            setActiveCategory(title);
        });
      },
      { rootMargin: '-10% 0px 0px 0px', threshold: 1.0 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [setActiveCategory, title]);

  function populateMenuPositions({ menuPositions }: NonNullable<typeof data>) {
    return menuPositions.map((menuPosition) => (
      // TODO: Replace with actual menuPosition component
      <div>{menuPosition.menuPositionName}</div>
    ));
  }

  return (
    <section ref={sectionRef}>
      <h2 className='my-5 pb-2 text-2xl'>{title}</h2>
      {isSuccess && populateMenuPositions(data)}
    </section>
  );
}