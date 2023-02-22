import type { Topping } from '@prisma/client';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';
import { ToppingsSection } from 'components/ToppingsSection';
import type { PositionFormState } from 'components/MenuPositionModal';
import { useFormContext } from 'react-hook-form';

export function PizzaForm({
  categoryMap,
  position,
  description,
  products,
  toppings,
}: {
  categoryMap: PositionFormState;
  products: ProductState;
  toppings: ToppingState;
  position: DenormalizedMenuPosition;
  description: string;
}) {
  const methods = useFormContext();
  const product = products.entities[categoryMap.product];

  if (!product) return null;
  const productToppings = product.toppings
    .map((toppingId) => toppings.entities[toppingId])
    .filter((topping): topping is Topping => !!topping);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={methods.handleSubmit((data) => console.log())}>
      {description}
      <ToppingsSection toppings={productToppings} />
    </form>
  );
}
