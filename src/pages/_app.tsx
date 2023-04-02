import { OrdersProvider } from 'hooks/useOrders';
import { type AppProps, type AppType } from 'next/app';

import { api } from 'utils/api';

import '../styles/globals.css';

const MyApp: AppType = ({ Component }: AppProps) => (
  <OrdersProvider>
    <Component />
    <div id='portal_root' />
  </OrdersProvider>
);

export default api.withTRPC(MyApp);
