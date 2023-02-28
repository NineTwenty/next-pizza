import type { Ingredient, Topping } from '@prisma/client';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedMenuPosition } from 'types/server';
import { ToppingsSection } from 'components/ToppingsSection';
import type { PositionFormState } from 'components/MenuPositionModal';
import { useFormContext } from 'react-hook-form';
import { IngredientsSection } from 'components/IngredientsSection';
import { VariationsSection } from 'components/VariationsSection';

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
  const formContext = useFormContext<PositionFormState>();
  const product = products.entities[formContext.getValues('product')];

  if (!product) return null;
  const variation = product.variations.find(
    // getValues is lying about type and its actually always 'string'
    ({ id }) => id === Number(formContext.getValues('variation'))
  );
  const productToppings = product.toppings
    .map((toppingId) => toppings.entities[toppingId])
    .filter((topping): topping is Topping => !!topping);

  return (
    <form
      id={formId}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={formContext.handleSubmit((data) => console.log(data))}
    >
      <div className='mb-1 text-sm text-gray-500'>{`${variation?.size}, ${variation?.weight}`}</div>
      <IngredientsSection ingredients={ingredients} />
      <VariationsSection variations={product.variations} />
      <ToppingsSection toppings={productToppings} />
    </form>
  );
}
