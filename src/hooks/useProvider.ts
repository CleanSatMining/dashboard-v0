import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

type UseProvider = () => {
  isLoaded: boolean;
};

export const useProvider: UseProvider = () => {
  const { account, provider } = useWeb3React();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (account && !isLoaded && provider) {
      setIsLoaded(true);
    }
  }, [account, provider, setIsLoaded, isLoaded]);

  return {
    isLoaded,
  };
};
