import { MenuPosition } from 'components/MenuPosition';
import { MenuPositionForm } from 'components/MenuPositionForm';
import { MenuPositionSkeleton } from 'components/MenuPositionSkeleton';
import { useMenuPositions } from 'utils/apiHooks';

type CategoryProps = {
  id: number;
  title: string;
};

export function CategoryEntry({ title, id }: CategoryProps) {
  const { isSuccess, data } = useMenuPositions({ category: id });

  function populateMenuPositions({
    menuPositions,
    products,
    toppings,
  }: NonNullable<typeof data>) {
    return menuPositions.ids.map((positionId) => {
      const position = menuPositions.entities[positionId];
      return position ? (
        <MenuPosition
          name={position.menuPositionName}
          position={position}
          key={positionId}
        >
          {({ closeCallback, positionIngredients }) => (
            <MenuPositionForm
              position={position}
              name={position.menuPositionName}
              ingredients={positionIngredients}
              toppings={toppings}
              products={products}
              closeCallback={closeCallback}
            />
          )}
        </MenuPosition>
      ) : null;
    });
  }

  if (isSuccess && data.menuPositions.ids.length === 0) {
    return null;
  }

  return (
    <section id={title}>
      <h2 className='my-5 pb-2 text-2xl font-semibold md:text-4xl md:font-bold md:tracking-tight'>
        {title}
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-4 md:gap-7 md:gap-y-14'>
        {(isSuccess && populateMenuPositions(data)) ||
          new Array(5).fill(<MenuPositionSkeleton />)}
      </div>
    </section>
  );
}
