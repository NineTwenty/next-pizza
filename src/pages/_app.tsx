import { type AppProps, type AppType } from 'next/app';

import { api } from 'utils/api';

import '../styles/globals.css';

const MyApp: AppType = ({ Component }: AppProps) => (
  <>
    <Component />
    <div id='portal_root' />
  </>
);

export default api.withTRPC(MyApp);
