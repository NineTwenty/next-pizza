import type { Topping } from '@prisma/client';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';
import { ToppingsSection } from 'components/ToppingsSection';

export function PizzaForm({
  position,
  description,
  products,
  toppings,
}: {
  products: ProductState;
  toppings: ToppingState;
  position: DenormalizedMenuPosition;
  description: string;
}) {
  const product =
    products.entities[
      position.categoryMap.reduce(
        (acc, { defaultProduct }) => defaultProduct,
        0
      )
    ];

  if (!product) return null;
  const productToppings = product.toppings
    .map((toppingId) => toppings.entities[toppingId])
    .filter((topping): topping is Topping => !!topping);

  return (
    <>
      {description}
      <ToppingsSection toppings={productToppings} />
    </>
  );
}
