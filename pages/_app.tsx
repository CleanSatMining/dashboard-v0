import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as ReduxProvide } from 'react-redux';

import type { AppProps as NextAppProps } from 'next/app';

import { ColorScheme, Image } from '@mantine/core';
import {
  ChainSelectConfig,
  Head,
  LanguageInit,
  Layout,
  MantineProviders,
  RealtProvider,
  Web3Providers,
  getConnectors,
  getWalletConnectV2,
  gnosisHooks,
  gnosisSafe,
  initLanguage,
  metaMask,
  metaMaskHooks,
  parseAllowedChain,
} from '@realtoken/realt-commons';

import { Provider as JotaiProvider } from 'jotai';

import { Logo } from 'src/assets';
import 'src/i18next';
import { resources } from 'src/i18next';
import InitStoreProvider from 'src/providers/InitStoreProvider';
import store from 'src/store/store';

import { modals } from '../src/components';
import { HeaderNav } from '../src/components/HeaderNav';
import { CHAINS, ChainsID, Chain as CustomChain } from '../src/constants';
import { modalStyles, theme } from '../src/theme';

export const i18n = initLanguage(resources);

const customChains: ChainSelectConfig<CustomChain> = {
  allowedChains: parseAllowedChain(ChainsID),
  chainsConfig: CHAINS,
};

const showAllNetworks = true;

const env = process.env.NEXT_PUBLIC_ENV ?? 'development';
const walletConnectKey = process.env.NEXT_PUBLIC_WALLET_CONNECT_KEY ?? '';

console.log('key: ', walletConnectKey);

const [walletConnectV2, walletConnectV2Hooks] = getWalletConnectV2<CustomChain>(
  customChains,
  env,
  walletConnectKey,
  showAllNetworks
);

const libraryConnectors = getConnectors(
  [metaMask, metaMaskHooks],
  [gnosisSafe, gnosisHooks],
  [walletConnectV2, walletConnectV2Hooks]
);

type AppProps = NextAppProps & { colorScheme: ColorScheme; locale: string };

const queryClient = new QueryClient({});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <RealtProvider value={{ env, showAllNetworks }}>
          <ReduxProvide store={store}>
            <Web3Providers libraryConnectors={libraryConnectors}>
              <InitStoreProvider>
                <MantineProviders
                  modals={modals}
                  modalStyles={modalStyles}
                  theme={theme}
                >
                  <LanguageInit i={i18n} />
                  <Layout
                    chains={customChains}
                    headerNav={<HeaderNav />}
                    head={
                      <Head
                        title={'CleanSatMining Dashboard'}
                        description={'CleanSatMining Dashboard'}
                      />
                    }
                    newWebsite={{
                      name: 'CleanSatMining Dashboard',
                      url: '/',
                      logo: () => (
                        <Image src={Logo.src} alt={'CSM Logo'} width={36} />
                      ),
                      comingSoon: false,
                    }}
                    disableHeaderMultisite={true}
                  >
                    <Component {...pageProps} />
                  </Layout>
                </MantineProviders>
              </InitStoreProvider>
            </Web3Providers>
          </ReduxProvide>
        </RealtProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default App;
