import { useForm, useFormContext } from 'react-hook-form';
import type { ProductState } from 'types/client';
import type { CategoryMap } from 'types/server';

export type PositionProductState = {
  product: number;
  includedToppings: number[];
  excludedIngredients: number[];
  variation: number;
};

export type PositionState = {
  id: number;
  product: number;
  byProductState: PositionProductState[];
};

export type PositionFormState = {
  categoryMaps: PositionState[];
};

export function usePositionForm({
  categoryMaps,
  products,
  orders,
}: {
  categoryMaps: CategoryMap[];
  products: ProductState;
  orders?: PositionState[];
}) {
  const methods = useForm<PositionFormState>({
    defaultValues: {
      categoryMaps:
        orders ??
        categoryMaps.map((categoryMap) => {
          const defaultProduct = products.entities[categoryMap.defaultProduct];

          if (!defaultProduct) {
            throw new Error('Attempt to access missing default product');
          }

          return {
            id: categoryMap.id,
            product: defaultProduct.id,
            byProductState: categoryMap.products.map((id) => {
              const { variations } = products.entities[id] ?? {};

              if (!variations) {
                throw new Error(
                  'Attempt to access missing product while making initial form value'
                );
              }

              return {
                product: id,
                includedToppings: [],
                excludedIngredients: [],
                variation:
                  variations.length > 1 ? variations[1]?.id : variations[0]?.id,
              };
            }),
          };
        }),
    },
  });

  return { ...methods, defaultFormValues: methods.getValues('categoryMaps') };
}

export function usePositionFormContext() {
  return useFormContext<PositionFormState>();
}
