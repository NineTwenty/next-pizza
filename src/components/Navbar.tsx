import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

type NavbarProps = {
  links: string[];
  activeLink: string | undefined;
};

export function Navbar({ links, activeLink }: NavbarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const observer = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          entries.forEach(({ intersectionRatio }) => {
            setIsSticky(intersectionRatio < 1);
          });
        },
        { threshold: [1] }
      ),
    []
  );

  useEffect(() => {
    if (navRef.current) {
      observer.observe(navRef.current);
    }
    return () => observer.disconnect();
  }, [observer]);

  return (
    <nav
      ref={navRef}
      className={`before:content-[" "] line sticky top-[-1px] flex place-items-center overflow-x-scroll bg-white text-sm before:h-14 before:w-3 before:flex-none ${
        isSticky ? 'shadow' : ''
      }`}
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
            className={`m-1 h-8 rounded-2xl bg-gray-100 px-4 leading-8 text-gray-600 ${
              path === activeLink ? 'bg-orange-100 text-orange-700' : ''
            }`}
          >
            <a href={`#${path}`}>{path}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
