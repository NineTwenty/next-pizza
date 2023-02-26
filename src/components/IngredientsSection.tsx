import type { Ingredient } from '@prisma/client';
import { PlusCircle, XCircle } from 'react-feather';
import { useFormContext } from 'react-hook-form';

type IngredientSectionProps = {
  ingredients: Ingredient[];
};

const fieldName = 'excludedIngredients';

export function IngredientsSection({ ingredients }: IngredientSectionProps) {
  const { register } = useFormContext();
  return (
    <section>
      <ul className='w-full text-sm first:first-letter:uppercase'>
        {ingredients.map((ingredient, index) => {
          if (!ingredient) return null;
          return (
            <li key={ingredient.id} className='inline pr-1'>
              {ingredient.optional ? (
                <label>
                  <input
                    type='checkbox'
                    value={ingredient.id}
                    {...register(fieldName)}
                    className='peer sr-only first-letter:uppercase'
                  />
                  <span className='h-8 border-b border-dashed border-gray-500 text-center decoration-dashed underline-offset-4 peer-checked:border-transparent peer-checked:line-through peer-checked:decoration-solid'>
                    {ingredient.ingredientName}
                  </span>
                  <XCircle className='ml-1 inline-block h-[0.875rem] w-[0.875rem] text-gray-500 peer-checked:hidden' />
                  <PlusCircle className='ml-1 hidden h-[0.875rem] w-[0.875rem] text-gray-500 peer-checked:inline-block' />
                </label>
              ) : (
                <span className='h-8 text-center'>
                  {ingredient.ingredientName}
                </span>
              )}
              {index < ingredients.length - 1 ? ',' : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
