import { useEffect, useMemo, useRef, useState } from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import { ShoppingCart, X } from 'react-feather';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from 'utils/api';
import { useOrders } from 'hooks/useOrders';
import { Navbar } from 'components/Navbar';
import { CategoryEntry } from 'components/CategoryEntry';
import { Header } from 'components/Header';
import { Cart } from 'components/Cart';
import { Modal } from 'components/Modal';
import { Loader } from 'components/Loader';

const Home: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>();
  const { isSuccess, data } = api.entities.getCategories.useQuery(undefined, {
    staleTime: Infinity,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { ordersIds } = useOrders();

  const categoryEntryRefs = useRef<HTMLDivElement[]>([]);
  const observer = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              entry.target instanceof HTMLDivElement &&
              data
            ) {
              const entryIndex = categoryEntryRefs.current.indexOf(
                entry.target
              );
              const name = data[entryIndex]?.categoryName;
              setActiveCategory(name);
            }
          });
        },
        { threshold: [0.25] }
      );
    }
    return null;
  }, [data]);

  useEffect(() => {
    categoryEntryRefs.current.forEach((element) => {
      observer?.observe(element);
    });
    return () => observer?.disconnect();
  }, [categoryEntryRefs.current.length, observer]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {isSuccess ? (
        <div className='flex min-h-screen flex-col scroll-smooth'>
          <Header
            showCloseButton={isCartOpen}
            onCloseButtonClick={() => setIsCartOpen(false)}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />

          <Navbar
            activeLink={activeCategory}
            links={data
              .filter(
                ({ listed, categoryName }) =>
                  listed &&
                  (categoryName === 'Пицца' || categoryName === 'Комбо')
              )
              .map(({ categoryName }) => categoryName)}
            onCartClick={() => setIsCartOpen(true)}
          />
          <main className='max-w-7xl px-4 md:mx-auto md:w-5/6 md:px-0'>
            {data.map((category, index) =>
              category.listed ? (
                <div
                  className='empty:hidden'
                  key={category.id}
                  ref={(element) => {
                    if (element) {
                      categoryEntryRefs.current[index] = element;
                    }
                  }}
                >
                  <CategoryEntry
                    id={category.id}
                    title={category.categoryName}
                  />
                </div>
              ) : null
            )}
            {ordersIds.length > 0 && (
              <div className='sticky bottom-0 h-px md:hidden'>
                <button
                  aria-label='Открыть корзину'
                  type='button'
                  className='relative -top-[4.5rem] ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[rgba(0,0,0,0.2)0px_10px_20px]'
                  onClick={() => setIsCartOpen(true)}
                >
                  <div className='absolute -right-1 top-0 flex h-5 min-w-[1.25rem] place-items-center justify-center rounded-full bg-orange-500 text-sm text-white'>
                    {ordersIds.length}
                  </div>
                  <ShoppingCart className='-ml-1 stroke-orange-500' />
                </button>
              </div>
            )}
          </main>
          <footer className='mt-auto flex flex-col border-t-8 border-orange-500 bg-black/90 p-4 leading-loose text-white'>
            <div className='mx-auto w-5/6 max-w-7xl'>
              <div className='border-b border-white/10 pb-4'>
                Feedback@pizza.com
              </div>
              <section className='justify-between py-2 md:flex md:w-full'>
                <div className='py-2'>
                  <h1 className='font-extrabold'>Next Пицца</h1>
                  <ul className='text-white/80'>
                    <li>О нас</li>
                    <li>Блог</li>
                  </ul>
                </div>
                <div className='py-2'>
                  <h1 className='font-extrabold'>Работа</h1>
                  <ul className='text-white/80'>
                    <li>В пиццерии</li>
                  </ul>
                </div>
                <div className='border-b border-white/10 py-2 pb-4 md:border-transparent'>
                  <h1 className='font-extrabold'>Партнерам</h1>
                  <ul className='text-white/80'>
                    <li>Инвестиции</li>
                    <li>Поставщикам</li>
                  </ul>
                </div>
                <div className='hidden flex-col place-items-end md:flex'>
                  <p className='text-2xl font-bold'>8 888 888-88-88</p>
                  <p className='text-gray-300'>Звонок бесплатный</p>
                  <p>Feedback@pizza.com</p>
                </div>
              </section>
              <div className='border-gray-700 py-2 text-white/80 md:flex md:place-items-center md:border-t'>
                <ul className='gap-4 text-white/80 md:order-2 md:mr-4 md:flex'>
                  <li>Правовая информация</li>
                  <li>Калорийность</li>
                  <li>Помощь</li>
                </ul>
                <div className='md: mr-4 py-4'>
                  <span className='text-lg font-extrabold'>NEXT ПИЦЦА </span>©
                  2023
                </div>
              </div>
            </div>
          </footer>
          <AnimatePresence>
            {isCartOpen && (
              <Modal>
                <motion.div
                  className='fixed top-[3rem] grid h-full w-full bg-black/70 md:top-0 md:grid-cols-3'
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                  <motion.section
                    transition={{ bounce: 0 }}
                    variants={{ hidden: { x: '100%' }, visible: { x: 0 } }}
                    className='md:col-start-3'
                  >
                    <motion.button
                      className='absolute top-1/2 -ml-14 -mt-5 hidden md:block'
                      type='button'
                      onClick={() => setIsCartOpen(false)}
                      transition={{ duration: 0.3, ease: [0.5, 1, 0.5, 1] }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 180,
                        transition: {
                          duration: 0.5,
                          ease: 'easeInOut',
                        },
                      }}
                    >
                      <X className='h-10 w-10 text-white' />
                    </motion.button>
                    <Cart />
                  </motion.section>
                </motion.div>
              </Modal>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className='flex h-screen place-items-center justify-center'>
          <Loader />
        </div>
      )}
    </>
  );
};

export default Home;
