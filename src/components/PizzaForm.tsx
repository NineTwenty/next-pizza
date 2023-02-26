import type { Ingredient, Topping } from '@prisma/client';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';
import { ToppingsSection } from 'components/ToppingsSection';
import type { PositionFormState } from 'components/MenuPositionModal';
import { useFormContext } from 'react-hook-form';
import { IngredientsSection } from 'components/IngredientsSection';

export function PizzaForm({
  categoryMap,
  position,
  products,
  toppings,
  ingredients,
  formId,
}: {
  categoryMap: PositionFormState;
  products: ProductState;
  toppings: ToppingState;
  position: DenormalizedMenuPosition;
  ingredients: Ingredient[];
  formId: string;
}) {
  const methods = useFormContext();
  const product = products.entities[categoryMap.product];

  if (!product) return null;
  const productToppings = product.toppings
    .map((toppingId) => toppings.entities[toppingId])
    .filter((topping): topping is Topping => !!topping);

  return (
    <form
      id={formId}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={methods.handleSubmit((data) => console.log(data))}
    >
      <IngredientsSection ingredients={ingredients} />
      <ToppingsSection toppings={productToppings} />
    </form>
  );
}
