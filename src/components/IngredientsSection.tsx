import type { Ingredient } from '@prisma/client';
import { usePositionFormContext } from 'hooks/usePositionForm';
import { PlusCircle, XCircle } from 'react-feather';

type IngredientSectionProps = {
  onlyOptional?: boolean;
  ingredients: Ingredient[];
  fieldGroupId: number;
  productId: number;
};

export function IngredientsSection({
  onlyOptional = false,
  ingredients,
  fieldGroupId,
  productId,
}: IngredientSectionProps) {
  const { register } = usePositionFormContext();
  return (
    <section>
      <ul
        className={
          onlyOptional
            ? 'flex flex-wrap gap-2'
            : 'w-full text-sm first:first-letter:uppercase'
        }
      >
        {ingredients.map((ingredient, index) => {
          if (!ingredient || (onlyOptional && !ingredient.optional))
            return null;
          return (
            <li
              key={ingredient.id}
              className={onlyOptional ? '' : 'inline pr-1'}
            >
              {ingredient.optional ? (
                <label>
                  <input
                    type='checkbox'
                    value={ingredient.id}
                    {...register(
                      `categoryMaps.${fieldGroupId}.byProductState.${productId}.excludedIngredients`
                    )}
                    className='peer sr-only first-letter:uppercase'
                  />
                  <span
                    className={`${
                      onlyOptional
                        ? 'block rounded-full bg-orange-100 p-2 px-4 text-sm leading-4 text-orange-600 line-through decoration-transparent peer-checked:bg-gray-100 peer-checked:text-gray-400 peer-checked:decoration-current'
                        : 'h-8 border-b border-dashed border-gray-500'
                    } text-center decoration-dashed underline-offset-4 transition-colors peer-checked:border-transparent peer-checked:line-through peer-checked:decoration-solid`}
                  >
                    {ingredient.ingredientName}
                  </span>
                  {!onlyOptional && (
                    <>
                      <XCircle className='ml-1 inline-block h-[0.875rem] w-[0.875rem] text-gray-500 peer-checked:hidden' />
                      <PlusCircle className='ml-1 hidden h-[0.875rem] w-[0.875rem] text-gray-500 peer-checked:inline-block' />
                    </>
                  )}
                </label>
              ) : (
                <span className='h-8 text-center'>
                  {ingredient.ingredientName}
                </span>
              )}
              {!onlyOptional && index < ingredients.length - 1 ? ',' : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
