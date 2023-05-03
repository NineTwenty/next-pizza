import { MenuPosition } from 'components/MenuPosition';
import { MenuPositionForm } from 'components/MenuPositionForm';
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

  function populateMenuPositions({
    menuPositions,
    ingredients,
    products,
    toppings,
  }: NonNullable<typeof data>) {
    return menuPositions.ids.map((positionId) => {
      const position = menuPositions.entities[positionId];
      return position ? (
        <MenuPosition
          name={position.menuPositionName}
          position={position}
          ingredients={ingredients}
          products={products}
          key={positionId}
        >
          {({ closeCallback, description, positionIngredients }) => (
            <MenuPositionForm
              position={position}
              name={position.menuPositionName}
              ingredients={positionIngredients}
              toppings={toppings}
              products={products}
              description={description}
              closeCallback={closeCallback}
            />
          )}
        </MenuPosition>
      ) : null;
    });
  }

  if (!isSuccess || (isSuccess && data.menuPositions.ids.length === 0)) {
    return null;
  }

  return (
    <section ref={sectionRef}>
      <h2 className='my-5 pb-2 text-2xl font-semibold md:text-4xl md:font-bold md:tracking-tight'>
        {title}
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-4 md:gap-7 md:gap-y-14'>
        {isSuccess && populateMenuPositions(data)}
      </div>
    </section>
  );
}
