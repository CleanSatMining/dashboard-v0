import { Token } from '.graphclient';
import { BigNumber } from 'bignumber.js';
import { gql } from '@apollo/client';
import { ShortProperty, PropertiesERC20 } from 'src/types';
import { Offer, OFFER_TYPE } from 'src/types/offer';
import { getYamClient, getRealTokenClient } from './offers/getClientURL';

export const getERC20Properties = async (): Promise<PropertiesERC20[]> => {
  return new Promise<PropertiesERC20[]>(async (resolve, reject) => {
    try {
      const client = getRealTokenClient(100);
      const { data } = await client.query({
        query: gql`
          query GetTokensProperties {
            tokens {
              address
              decimals
              fullName
              symbol
              totalSupply
            }
          }
        `,
      });

      if (data.tokens) {
        const propertiesToken: PropertiesERC20[] = [];
        // console.log("lenght: ", data.tokens.length);
        data.tokens.forEach((token: Token) => {
          propertiesToken.push({
            fullName: token.fullName,
            symbol: token.symbol,
            supply: divideByPowerOf10(token.totalSupply, token.decimals),
            uuid: token.address,
            contractAddress: token.address,
            decimals: token.decimals,
          });
        });
        resolve(propertiesToken);
      } else {
        resolve([]);
      }
    } catch (err) {
      console.log('Failed to get propertieqs from YAM TheGraph: ', err);
      reject(err);
    }
  });
};

export const getWhitelistedProperties = async (
  chainId: number,
): Promise<ShortProperty[]> => {
  return new Promise<ShortProperty[]>(async (resolove, reject) => {
    try {
      const client = getYamClient(chainId);
      const { data } = await client.query({
        query: gql`
          query GetWLProperties {
            tokens(first: 1000, where: { tokenType: 1, name_not: null }) {
              name
              tokenType
              address
            }
          }
        `,
      });

      if (data.tokens) {
        const propertiesToken: ShortProperty[] = [];
        // console.log("lenght: ", data.tokens.length);
        data.tokens.forEach((token: Token) => {
          // if(token.name?.toLowerCase().includes('19003')){
          //     console.log(token)
          // }
          propertiesToken.push({
            contractAddress: token.address,
            name: token.name ?? '',
          });
        });
        resolove(propertiesToken);
      } else {
        resolove([]);
      }
    } catch (err) {
      console.log('Failed to get propertieqs from YAM TheGraph: ', err);
      reject(err);
    }
  });
};

export const getPropertyTokenAddress = (offer: Offer): string => {
  return offer.type == OFFER_TYPE.SELL
    ? offer.buyerTokenAddress
    : offer.offerTokenAddress;
};

function divideByPowerOf10(NUMBER: number, N: number): number {
  // Convert the string to a BigNumber object
  const numberBN = new BigNumber(NUMBER);

  // Calculate 10^N as a new BigNumber object
  const powerOf10 = new BigNumber(10).exponentiatedBy(N);

  // Divide the number by 10^N
  const result = numberBN.dividedBy(powerOf10);

  // Return the result as a string
  return result.toNumber();
}
