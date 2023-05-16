import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useOrders } from 'hooks/useOrders';
import { ArrowLeft, ArrowRight } from 'react-feather';

type NavbarProps = {
  links: string[];
  activeLink: string | undefined;
  onCartClick: () => void;
};

export function Navbar({ links, activeLink, onCartClick }: NavbarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const observer = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach(({ intersectionRatio }) => {
            setIsSticky(intersectionRatio < 1);
          });
        },
        { threshold: [1] }
      );
    }
    return null;
  }, []);

  useEffect(() => {
    if (observer && navRef.current) {
      observer.observe(navRef.current);
    }
    return () => observer?.disconnect();
  }, [observer]);

  const { ordersIds } = useOrders();

  return (
    <nav
      ref={navRef}
      className={`sticky top-[-1px] bg-white md:bg-[rgba(255,255,255,0.75)] md:backdrop-blur-xl ${
        isSticky ? 'shadow-[rgb(6_5_50_/_10%)_0px_4px_30px]' : ''
      }`}
    >
      <div
        className={`before:content-[" "] flex max-w-7xl place-items-center overflow-x-auto text-sm font-semibold before:h-[3.625rem] before:w-3 before:flex-none md:mx-auto md:w-5/6 md:before:w-0`}
      >
        <Image
          className={`transition-[transform,margin-right] ease-out ${
            isSticky ? 'mr-1 -translate-x-0' : '-mr-8 -translate-x-12'
          }`}
          src='logo.svg'
          width={32}
          height={32}
          alt='Logo'
        />
        <ul className='flex'>
          {links.map((path) => (
            <li
              key={path}
              className={`duration-250 m-1 h-8 rounded-2xl px-4 leading-8 ease-linear md:bg-transparent md:pl-0 md:transition-colors md:hover:text-orange-500 ${
                path === activeLink
                  ? 'bg-orange-100 text-orange-700 md:text-orange-500'
                  : 'bg-gray-100 text-gray-600 md:text-black'
              }`}
            >
              <a href={`#${path}`}>{path}</a>
            </li>
          ))}
          <li className='duration-250 m-1 hidden h-8 rounded-2xl px-4 leading-8 ease-linear md:block md:bg-transparent md:pl-0 md:transition-colors md:hover:text-orange-500'>
            Акции
          </li>
          <li className='duration-250 m-1 hidden h-8 rounded-2xl px-4 leading-8 ease-linear md:block md:bg-transparent md:pl-0 md:transition-colors md:hover:text-orange-500'>
            Контакты
          </li>
          <li className='duration-250 m-1 hidden h-8 rounded-2xl px-4 leading-8 ease-linear md:block md:bg-transparent md:pl-0 md:transition-colors md:hover:text-orange-500'>
            О нас
          </li>
        </ul>
        <button
          onClick={onCartClick}
          type='button'
          className='group ml-auto hidden rounded-full bg-orange-500 p-2 px-4 text-base font-semibold text-white transition-colors hover:bg-orange-600 md:block'
        >
          Корзина
          {ordersIds.length > 0 && (
            <span className='relative ml-3 inline-flex place-items-center border-l border-white/40 pl-3 pr-1'>
              <span className='absoulte transition-[opacity,transform] duration-200 ease-in-out group-hover:translate-x-1 group-hover:opacity-0'>
                {ordersIds.length}
              </span>
              <ArrowRight className='absolute h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,transform] duration-200 ease-in-out group-hover:translate-x-0 group-hover:opacity-100' />
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
