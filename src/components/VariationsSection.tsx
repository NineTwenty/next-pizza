import type { ProductVariation } from '@prisma/client';
import { useFormContext } from 'react-hook-form';

type VariationSectionProps = {
  variations: ProductVariation[];
  fieldGroupId: number;
};

export function VariationsSection({
  variations,
  fieldGroupId,
}: VariationSectionProps) {
  const { register, watch } = useFormContext();
  const fieldName = `${fieldGroupId}.variation`;
  const variationId = watch(fieldName);
  const animationPosition = [
    '-translate-x-full',
    'translate-x-0',
    'translate-x-full',
  ] as const;

  return (
    <div className='relative my-4 flex items-center justify-evenly overflow-hidden rounded-full bg-gray-100 text-xs '>
      <div
        className={`${
          animationPosition[variationId - 1] ?? animationPosition[1]
        } absolute top-0 bottom-0 w-1/3 p-[0.125rem] transition-transform duration-200 ease-out before:block before:h-full before:w-full before:rounded-full before:bg-white before:shadow-[rgb(6,5,50,0.19)_0px_6px_20px]`}
      />
      {variations.map(({ size, id }) => (
        <label
          className='z-[11] flex h-8 flex-1 cursor-pointer items-center justify-center'
          key={id}
        >
          <input
            type='radio'
            value={id}
            className='sr-only'
            {...register(fieldName)}
          />
          <div>{size}</div>
        </label>
      ))}
    </div>
  );
}
