import { useForm } from 'react-hook-form';
import type { ProductState } from 'types/client';
import type { DenormalizedCategoryMap } from 'types/server';

export type PositionState = {
  id: number;
  product: number;
  includedToppings: number[];
  excludedIngredients: number[];
  variation: number;
};

export type PositionFormState = {
  categoryMaps: PositionState[];
};

export function usePositionForm({
  categoryMaps,
  products,
}: {
  categoryMaps: DenormalizedCategoryMap[];
  products: ProductState;
}) {
  const methods = useForm<PositionFormState>({
    defaultValues: {
      categoryMaps: categoryMaps.map((categoryMap) => {
        const defaultProduct = products.entities[categoryMap.defaultProduct];

        if (!defaultProduct) {
          throw new Error('Attempt to access missing default product');
        }

        return {
          id: categoryMap.id,
          product: defaultProduct.id,
          includedToppings: [],
          excludedIngredients: [],
          variation:
            defaultProduct.variations.length > 1
              ? defaultProduct.variations[1]?.id
              : defaultProduct.variations[0]?.id,
        };
      }),
    },
  });

  return { ...methods, defaultFormValues: methods.getValues('categoryMaps') };
}
