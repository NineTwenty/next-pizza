import type { ProductVariation } from '@prisma/client';
import type { PositionFormState } from 'hooks/usePositionForm';
import { Controller, useFormContext } from 'react-hook-form';

type VariationSectionProps = {
  variations: ProductVariation[];
  fieldGroupId: number;
};

export function VariationsSection({
  variations,
  fieldGroupId,
}: VariationSectionProps) {
  const { control } = useFormContext<PositionFormState>();
  const animationPosition = [
    '-translate-x-full',
    'translate-x-0',
    'translate-x-full',
  ] as const;

  const animationMap = new Map(
    variations.map(({ id }, i) => [id, animationPosition[i]])
  );

  return (
    <Controller
      name={`categoryMaps.${fieldGroupId}.variation`}
      control={control}
      render={({ field }) => (
        <div className='relative my-4 flex items-center justify-evenly overflow-hidden rounded-full bg-gray-100 text-xs '>
          <div
            className={`${
              animationMap.get(field.value) ?? ''
            } absolute top-0 bottom-0 w-1/3 p-[0.125rem] transition-transform duration-200 ease-out before:block before:h-full before:w-full before:rounded-full before:bg-white before:shadow-[rgb(6,5,50,0.19)_0px_6px_20px]`}
          />
          {variations.map(({ size, id }) => (
            <label
              className='z-[11] flex h-8 flex-1 cursor-pointer items-center justify-center'
              key={id}
            >
              <input
                type='radio'
                {...field}
                value={id}
                className='sr-only'
                onChange={(e) => {
                  const { value } = e.target;
                  if (typeof value === 'string') {
                    field.onChange(parseInt(value, 10));
                  }
                  if (typeof value === 'number') {
                    field.onChange(value);
                  }
                }}
              />
              <div>{size}</div>
            </label>
          ))}
        </div>
      )}
    />
  );
}
