import { Flex, Skeleton, Text } from '@mantine/core';
import { usePropertyToken } from 'src/hooks/usePropertyToken';
import { Offer, OFFER_TYPE } from 'src/types/offer';
import { TextIconLink } from '../Link/Link';

interface TokenNameProps {
  offer: Offer;
  tokenName?: string;
}
export const TokenName = ({ offer, tokenName }: TokenNameProps) => {
  const tokenAddress =
    offer.type == OFFER_TYPE.BUY
      ? offer.buyerTokenAddress
      : offer.offerTokenAddress;
  const { propertyToken } = usePropertyToken(tokenAddress);

  return (
    <Flex justify={'center'}>
      {tokenName ? (
        <Text style={{ textAlign: 'center' }}>{tokenName}</Text>
      ) : propertyToken ? (
        <TextIconLink url={propertyToken.marketplaceLink}>
          {propertyToken.shortName}
        </TextIconLink>
      ) : !tokenAddress ? (
        <Skeleton height={15} />
      ) : undefined}
    </Flex>
  );
};
