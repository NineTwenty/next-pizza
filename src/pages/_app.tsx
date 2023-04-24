import { OrdersProvider } from 'hooks/useOrders';
import { type AppProps, type AppType } from 'next/app';
import { Nunito } from 'next/font/google';

import { api } from 'utils/api';

import '../styles/globals.css';

const nunito = Nunito({
  subsets: ['cyrillic', 'latin'],
});

const MyApp: AppType = ({ Component }: AppProps) => (
  <OrdersProvider>
    {/* eslint-disable-next-line react/no-unknown-property */}
    <style jsx global>{`
      :root {
        --font-nunito: ${nunito.style.fontFamily};
      }
    `}</style>
    <Component />
    <div id='portal_root' />
  </OrdersProvider>
);

export default api.withTRPC(MyApp);
