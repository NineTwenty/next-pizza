import Image from 'next/image';
import type { Dispatch, SetStateAction } from 'react';
import {
  ChevronLeft,
  Info,
  MapPin,
  Menu,
  Smartphone,
  Star,
  X,
} from 'react-feather';

type HeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  showCloseButton?: boolean;
  onCloseButtonClick?: () => void;
};

export function Header({
  isMenuOpen,
  setIsMenuOpen,
  showCloseButton,
  onCloseButtonClick,
}: HeaderProps) {
  if (!isMenuOpen) {
    return (
      <header
        className={`mx-auto flex  h-12 max-w-7xl items-center font-medium md:h-fit md:min-h-[5.375rem] md:w-5/6 md:pb-4 md:pt-6 ${
          isMenuOpen ? 'border-b border-white/20 bg-black text-white' : ''
        }`}
      >
        {showCloseButton ? (
          <button
            aria-label='Закрыть корзину'
            type='button'
            onClick={onCloseButtonClick}
            className='h-full border-r px-3 md:hidden'
          >
            <ChevronLeft className='' />
          </button>
        ) : null}
        <Image
          className='ml-4 mr-3 md:ml-0 md:h-11 md:w-11'
          src='logo.svg'
          width={26}
          height={26}
          alt='Logo'
        />
        <div className='flex h-full flex-col justify-center md:mr-10 md:justify-between'>
          <h1 className='space-x-5 text-lg font-extrabold md:text-2xl md:leading-6'>
            NEXT PIZZA
          </h1>
          <p className='hidden text-sm text-gray-800 md:block'>Сеть пиццерий</p>
        </div>
        <div className='mr-10 hidden h-full md:block'>
          <p className='text-lg leading-5'>
            Доставка пиццы <span className='text-orange-600'>Москва</span>
          </p>
          <p className='mt-1 flex place-items-center text-sm'>
            32 мин • 4.8
            <Star className='ml-1 inline-block h-[0.875rem] w-[0.875rem] fill-yellow-400 stroke-yellow-400 ' />
          </p>
        </div>
        <div className='hidden h-full md:block'>
          <p className='text-lg leading-5'>8 888 888-88-88</p>
          <p className='mt-1 text-sm text-[rgb(153,153,153)]'>
            Звонок бесплатный
          </p>
        </div>
        <button className='ml-auto hidden rounded-full bg-gray-100 px-4 py-2 text-sm leading-4 text-gray-500 md:block'>
          Войти
        </button>
        <button
          onClick={() => setIsMenuOpen(() => !isMenuOpen)}
          type='button'
          className='ml-auto flex place-items-center px-4 md:hidden'
        >
          <Menu className='-mr-1 h-5' />
        </button>
      </header>
    );
  }

  return (
    <section className='absolute top-0 z-10 h-screen w-full overflow-auto overscroll-y-contain bg-black font-medium text-white '>
      {/* Force content overflow to trigger scroll and make overscroll-contain work */}
      <div className='h-[104vh]'>
        <header className='flex h-12 items-center border-b border-white/20 px-4'>
          <Image
            className='mr-3'
            src='logo.svg'
            width={26}
            height={26}
            alt='Logo'
          />
          <h1 className='space-x-5 text-lg font-extrabold'>NEXT PIZZA</h1>
          <button
            onClick={() => setIsMenuOpen(() => !isMenuOpen)}
            type='button'
            className='ml-auto flex place-items-center'
          >
            <X className='-mr-1' />
          </button>
        </header>
        <section className='text-xl'>
          <section className='flex flex-col'>
            <button
              type='button'
              className='ml-12 border-b border-white/20 py-4 text-left'
            >
              <div className='relative flex items-center'>
                <MapPin className='absolute -ml-8 h-5' />
                Москва
              </div>
              <p className='text-[0.813rem] leading-none text-gray-400'>
                Изменить
              </p>
            </button>
            <div className='ml-12 flex items-center gap-4 py-4'>
              <span>32 мин</span>
              <div className='flex items-center text-yellow-400'>
                {/* TODO: Replace with actual working star rating */}
                <span className='mr-1'>4.8</span>
                <div className='flex items-center  text-yellow-400'>
                  <Star className='-mr-1 h-4 fill-yellow-400 stroke-none ' />
                  <Star className='-mr-1 h-4 fill-yellow-400 stroke-none' />
                  <Star className='-mr-1 h-4 fill-yellow-400 stroke-none' />
                  <Star className='-mr-1 h-4 fill-yellow-400 stroke-none' />
                  <Star className='-mr-1 h-4 fill-white/40 stroke-none' />
                </div>
              </div>
              <Info className='ml-auto mr-4 h-6' />
            </div>
          </section>
          <nav className='border-t border-white/20 p-1'>
            <ul className='ml-12'>
              <li className='py-4 leading-none'>Войти</li>
              <li className='py-4 leading-none'>NextCoins</li>
              <li className='py-4 leading-none'>Персональные акции</li>
              <li className='py-4 leading-none'>Акции</li>
              <li className='py-4 leading-none'>Контакты</li>
              <li className='py-4 leading-none'>Работа</li>
              <li className='py-4 leading-none'>Франшиза</li>
              <li className='py-4 leading-none'>О нас</li>
            </ul>
          </nav>
          <footer className='flex flex-col border-t border-white/20'>
            <div className='relative ml-12 flex items-center pt-4 '>
              <Smartphone className='absolute -ml-8' />
              <a href='tel:88888888888'>8 888 888-88-88</a>
            </div>
            <p className='ml-12 text-[0.813rem] leading-none text-gray-400'>
              Звонок бесплатный
            </p>
          </footer>
        </section>
      </div>
    </section>
  );
}
