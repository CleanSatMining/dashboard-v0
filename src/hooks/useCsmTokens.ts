/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux';
import {
  selectCsmTokensIsLoading,
  selectCsmTokens,
} from 'src/store/features/interface/interfaceSelector';
import { PropertiesERC20 } from 'src/types/PropertiesToken';

type usePropertiesTokenReturn = {
  propertiesToken: PropertiesERC20[];
  propertiesIsloading: boolean;
  getPropertyToken: (address: string) => PropertiesERC20 | undefined;
};

export const useCsmTokens = (): usePropertiesTokenReturn => {
  const propertiesToken = useSelector(selectCsmTokens);
  const propertiesIsloading = useSelector(selectCsmTokensIsLoading);

  const getPropertyToken = (address: string): PropertiesERC20 | undefined => {
    return propertiesToken.find(
      (propertyToken) =>
        propertyToken.contractAddress.toLocaleLowerCase() ==
        address.toLowerCase(),
    );
  };
  console.log('csm tokens', propertiesToken);
  return {
    propertiesToken,
    propertiesIsloading,
    getPropertyToken,
  };
};
