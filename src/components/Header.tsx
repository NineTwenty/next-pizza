import Image from 'next/image';
import type { Dispatch, SetStateAction } from 'react';
import { Info, MapPin, Menu, Smartphone, Star, X } from 'react-feather';

type HeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  if (!isMenuOpen) {
    return (
      <header
        className={`flex h-12 items-center px-4 ${
          isMenuOpen ? 'border-b border-white/20 bg-black text-white' : ''
        }`}
      >
        <Image
          className='mr-3'
          src='logo.svg'
          width={26}
          height={26}
          alt='Logo'
        />
        <h1 className='space-x-5 text-lg font-bold tracking-wider'>
          NEXT PIZZA
        </h1>
        <button
          onClick={() => setIsMenuOpen(() => !isMenuOpen)}
          type='button'
          className='ml-auto flex place-items-center'
        >
          <Menu className='-mr-1 h-5' />
        </button>
      </header>
    );
  }

  return (
    <section className='absolute top-0 z-10 h-screen w-full overflow-auto overscroll-y-contain bg-black text-white '>
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
          <h1 className='space-x-5 text-lg font-bold tracking-wider'>
            NEXT PIZZA
          </h1>
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