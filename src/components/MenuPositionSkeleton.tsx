export function MenuPositionSkeleton() {
  return (
    <article className='flex w-full animate-pulse border-b border-slate-100 py-6 last:border-b-0 md:flex-col md:border-b-0'>
      <div className='mr-1 w-full max-w-[38%] p-5 pt-4 md:mr-0 md:max-w-full'>
        <div className='aspect-square w-full rounded-full bg-orange-300' />
      </div>
      <main className='flex w-full flex-col'>
        <p className='min-h-[1.75rem] w-1/2 rounded-2xl bg-gray-200 text-lg md:mb-2 md:w-4/5 md:text-xl' />
        <p className='mt-1 min-h-[1.75rem] w-5/6 rounded-2xl bg-gray-100 text-xs md:h-24 md:w-full md:text-base md:leading-5' />
        <div className='flex place-items-center justify-between'>
          <span className='hidden rounded-2xl bg-gray-50 font-semibold text-gray-50 md:block'>
            от 000 ₽
          </span>
          <button
            type='button'
            className='my-3 block h-8 w-fit min-w-[6rem] rounded-full bg-orange-100 text-sm/8 text-orange-100'
          >
            <span className='md:hidden'>от 000 ₽</span>
            <span className='hidden md:block'>Выбрать</span>
          </button>
        </div>
      </main>
    </article>
  );
}
