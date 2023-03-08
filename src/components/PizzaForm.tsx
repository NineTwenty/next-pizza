import type { Ingredient, Topping } from '@prisma/client';
import type { ProductState, ToppingState } from 'types/client';
import type { DenormalizedCategoryMap } from 'types/server';
import type { PositionFormState } from 'components/MenuPositionModal';
import { ToppingsSection } from 'components/ToppingsSection';
import { useFormContext } from 'react-hook-form';
import { IngredientsSection } from 'components/IngredientsSection';
import { VariationsSection } from 'components/VariationsSection';

export function PizzaForm({
  fieldGroupId,
  products,
  toppings,
  ingredients,
  formId,
}: {
  fieldGroupId: DenormalizedCategoryMap['id'];
  products: ProductState;
  toppings: ToppingState;
  ingredients: Ingredient[];
  formId: string;
}) {
  const formContext = useFormContext<PositionFormState>();
  const productId = formContext.getValues(
    `categoryMaps.${fieldGroupId}.product`
  );
  // getValues is lying about type and its actually always 'string'
  const variationId = Number(
    formContext.getValues(`categoryMaps.${fieldGroupId}.variation`)
  );

  if (typeof productId !== 'number') return null;
  const product = products.entities[productId];

  if (!product || typeof variationId !== 'number') return null;
  const variation = product.variations.find(({ id }) => id === variationId);
  const productToppings = product.toppings
    .map((toppingId) => toppings.entities[toppingId])
    .filter((topping): topping is Topping => !!topping);

  if (!variation) return null;

  return (
    <form
      id={formId}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={formContext.handleSubmit((data) => console.log(data))}
    >
      <div className='mb-1 text-sm text-gray-500'>{`${variation?.size}, ${variation?.weight}`}</div>
      <IngredientsSection
        fieldGroupId={fieldGroupId}
        ingredients={ingredients}
      />
      <VariationsSection
        fieldGroupId={fieldGroupId}
        variations={product.variations}
      />
      <ToppingsSection fieldGroupId={fieldGroupId} toppings={productToppings} />
    </form>
  );
}
