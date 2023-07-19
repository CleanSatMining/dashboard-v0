// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace YamGnosisTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

/**  Account entity  */
export type Account = {
  /**  User address  */
  id: Scalars['ID'];
  /**  User address  */
  address: Scalars['Bytes'];
  /**  User offers  */
  offers: Array<Offer>;
  /**  User purchases  */
  purchases: Array<Purchase>;
  /**  User sell  */
  sells: Array<Purchase>;
  /**  Purchase count  */
  purchaseCount: Scalars['BigInt'];
  /**  Sell count  */
  sellCount: Scalars['BigInt'];
  /**  Offer count  */
  offerCount: Scalars['BigInt'];
};


/**  Account entity  */
export type AccountoffersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Offer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Offer_filter>;
};


/**  Account entity  */
export type AccountpurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Purchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Purchase_filter>;
};


/**  Account entity  */
export type AccountsellsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Purchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Purchase_filter>;
};

export type Account_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  offers?: InputMaybe<Array<Scalars['String']>>;
  offers_not?: InputMaybe<Array<Scalars['String']>>;
  offers_contains?: InputMaybe<Array<Scalars['String']>>;
  offers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  offers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  offers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  offers_?: InputMaybe<Offer_filter>;
  purchases?: InputMaybe<Array<Scalars['String']>>;
  purchases_not?: InputMaybe<Array<Scalars['String']>>;
  purchases_contains?: InputMaybe<Array<Scalars['String']>>;
  purchases_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  purchases_not_contains?: InputMaybe<Array<Scalars['String']>>;
  purchases_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  purchases_?: InputMaybe<Purchase_filter>;
  sells?: InputMaybe<Array<Scalars['String']>>;
  sells_not?: InputMaybe<Array<Scalars['String']>>;
  sells_contains?: InputMaybe<Array<Scalars['String']>>;
  sells_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  sells_not_contains?: InputMaybe<Array<Scalars['String']>>;
  sells_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  sells_?: InputMaybe<Purchase_filter>;
  purchaseCount?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_not?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_gt?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_lt?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_gte?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_lte?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  purchaseCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  sellCount?: InputMaybe<Scalars['BigInt']>;
  sellCount_not?: InputMaybe<Scalars['BigInt']>;
  sellCount_gt?: InputMaybe<Scalars['BigInt']>;
  sellCount_lt?: InputMaybe<Scalars['BigInt']>;
  sellCount_gte?: InputMaybe<Scalars['BigInt']>;
  sellCount_lte?: InputMaybe<Scalars['BigInt']>;
  sellCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  sellCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  offerCount?: InputMaybe<Scalars['BigInt']>;
  offerCount_not?: InputMaybe<Scalars['BigInt']>;
  offerCount_gt?: InputMaybe<Scalars['BigInt']>;
  offerCount_lt?: InputMaybe<Scalars['BigInt']>;
  offerCount_gte?: InputMaybe<Scalars['BigInt']>;
  offerCount_lte?: InputMaybe<Scalars['BigInt']>;
  offerCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  offerCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Account_orderBy =
  | 'id'
  | 'address'
  | 'offers'
  | 'purchases'
  | 'sells'
  | 'purchaseCount'
  | 'sellCount'
  | 'offerCount';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/**  Offer entity  */
export type Offer = {
  /**  Offer ID  */
  id: Scalars['ID'];
  /**  Seller 0x  */
  seller: Account;
  /**  Offer token 0x */
  offerToken: Token;
  /**  Buyer token 0x */
  buyerToken: Token;
  /**  Price array  */
  prices: Array<OfferPrice>;
  /**  Current price  */
  price: OfferPrice;
  /**  Available amount  */
  availableAmount: Scalars['BigDecimal'];
  /**  Purchase array  */
  purchases: Array<Purchase>;
  /**  Purchase count  */
  purchaseCount: Scalars['BigInt'];
  /**  Buyer if offer is private  */
  buyer?: Maybe<Account>;
  /**  Offer creation block  */
  createdAtBlock: Scalars['BigInt'];
  /**  Offer creation timestamp  */
  createdAtTimestamp: Scalars['BigInt'];
  /**  Offer removal block  */
  removedAtBlock?: Maybe<Scalars['BigInt']>;
  /**  Offer removal timestamp  */
  removedAtTimestamp?: Maybe<Scalars['BigInt']>;
};


/**  Offer entity  */
export type OfferpricesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OfferPrice_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OfferPrice_filter>;
};


/**  Offer entity  */
export type OfferpurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Purchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Purchase_filter>;
};

/**  OfferPrice entity  */
export type OfferPrice = {
  id: Scalars['ID'];
  /**  Offer entity  */
  offer: Offer;
  /**  Price  */
  price: Scalars['BigDecimal'];
  /**  Amount  */
  amount: Scalars['BigDecimal'];
  /**  Creation block  */
  createdAtBlock: Scalars['BigInt'];
  /**  Creation timestamp  */
  createdAtTimestamp: Scalars['BigInt'];
};

export type OfferPrice_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  offer?: InputMaybe<Scalars['String']>;
  offer_not?: InputMaybe<Scalars['String']>;
  offer_gt?: InputMaybe<Scalars['String']>;
  offer_lt?: InputMaybe<Scalars['String']>;
  offer_gte?: InputMaybe<Scalars['String']>;
  offer_lte?: InputMaybe<Scalars['String']>;
  offer_in?: InputMaybe<Array<Scalars['String']>>;
  offer_not_in?: InputMaybe<Array<Scalars['String']>>;
  offer_contains?: InputMaybe<Scalars['String']>;
  offer_contains_nocase?: InputMaybe<Scalars['String']>;
  offer_not_contains?: InputMaybe<Scalars['String']>;
  offer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  offer_starts_with?: InputMaybe<Scalars['String']>;
  offer_starts_with_nocase?: InputMaybe<Scalars['String']>;
  offer_not_starts_with?: InputMaybe<Scalars['String']>;
  offer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  offer_ends_with?: InputMaybe<Scalars['String']>;
  offer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  offer_not_ends_with?: InputMaybe<Scalars['String']>;
  offer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  offer_?: InputMaybe<Offer_filter>;
  price?: InputMaybe<Scalars['BigDecimal']>;
  price_not?: InputMaybe<Scalars['BigDecimal']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']>;
  price_lt?: InputMaybe<Scalars['BigDecimal']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type OfferPrice_orderBy =
  | 'id'
  | 'offer'
  | 'price'
  | 'amount'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type Offer_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  seller?: InputMaybe<Scalars['String']>;
  seller_not?: InputMaybe<Scalars['String']>;
  seller_gt?: InputMaybe<Scalars['String']>;
  seller_lt?: InputMaybe<Scalars['String']>;
  seller_gte?: InputMaybe<Scalars['String']>;
  seller_lte?: InputMaybe<Scalars['String']>;
  seller_in?: InputMaybe<Array<Scalars['String']>>;
  seller_not_in?: InputMaybe<Array<Scalars['String']>>;
  seller_contains?: InputMaybe<Scalars['String']>;
  seller_contains_nocase?: InputMaybe<Scalars['String']>;
  seller_not_contains?: InputMaybe<Scalars['String']>;
  seller_not_contains_nocase?: InputMaybe<Scalars['String']>;
  seller_starts_with?: InputMaybe<Scalars['String']>;
  seller_starts_with_nocase?: InputMaybe<Scalars['String']>;
  seller_not_starts_with?: InputMaybe<Scalars['String']>;
  seller_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  seller_ends_with?: InputMaybe<Scalars['String']>;
  seller_ends_with_nocase?: InputMaybe<Scalars['String']>;
  seller_not_ends_with?: InputMaybe<Scalars['String']>;
  seller_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  seller_?: InputMaybe<Account_filter>;
  offerToken?: InputMaybe<Scalars['String']>;
  offerToken_not?: InputMaybe<Scalars['String']>;
  offerToken_gt?: InputMaybe<Scalars['String']>;
  offerToken_lt?: InputMaybe<Scalars['String']>;
  offerToken_gte?: InputMaybe<Scalars['String']>;
  offerToken_lte?: InputMaybe<Scalars['String']>;
  offerToken_in?: InputMaybe<Array<Scalars['String']>>;
  offerToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  offerToken_contains?: InputMaybe<Scalars['String']>;
  offerToken_contains_nocase?: InputMaybe<Scalars['String']>;
  offerToken_not_contains?: InputMaybe<Scalars['String']>;
  offerToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  offerToken_starts_with?: InputMaybe<Scalars['String']>;
  offerToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  offerToken_not_starts_with?: InputMaybe<Scalars['String']>;
  offerToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  offerToken_ends_with?: InputMaybe<Scalars['String']>;
  offerToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  offerToken_not_ends_with?: InputMaybe<Scalars['String']>;
  offerToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  offerToken_?: InputMaybe<Token_filter>;
  buyerToken?: InputMaybe<Scalars['String']>;
  buyerToken_not?: InputMaybe<Scalars['String']>;
  buyerToken_gt?: InputMaybe<Scalars['String']>;
  buyerToken_lt?: InputMaybe<Scalars['String']>;
  buyerToken_gte?: InputMaybe<Scalars['String']>;
  buyerToken_lte?: InputMaybe<Scalars['String']>;
  buyerToken_in?: InputMaybe<Array<Scalars['String']>>;
  buyerToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  buyerToken_contains?: InputMaybe<Scalars['String']>;
  buyerToken_contains_nocase?: InputMaybe<Scalars['String']>;
  buyerToken_not_contains?: InputMaybe<Scalars['String']>;
  buyerToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  buyerToken_starts_with?: InputMaybe<Scalars['String']>;
  buyerToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  buyerToken_not_starts_with?: InputMaybe<Scalars['String']>;
  buyerToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  buyerToken_ends_with?: InputMaybe<Scalars['String']>;
  buyerToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  buyerToken_not_ends_with?: InputMaybe<Scalars['String']>;
  buyerToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  buyerToken_?: InputMaybe<Token_filter>;
  prices?: InputMaybe<Array<Scalars['String']>>;
  prices_not?: InputMaybe<Array<Scalars['String']>>;
  prices_contains?: InputMaybe<Array<Scalars['String']>>;
  prices_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  prices_not_contains?: InputMaybe<Array<Scalars['String']>>;
  prices_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  prices_?: InputMaybe<OfferPrice_filter>;
  price?: InputMaybe<Scalars['String']>;
  price_not?: InputMaybe<Scalars['String']>;
  price_gt?: InputMaybe<Scalars['String']>;
  price_lt?: InputMaybe<Scalars['String']>;
  price_gte?: InputMaybe<Scalars['String']>;
  price_lte?: InputMaybe<Scalars['String']>;
  price_in?: InputMaybe<Array<Scalars['String']>>;
  price_not_in?: InputMaybe<Array<Scalars['String']>>;
  price_contains?: InputMaybe<Scalars['String']>;
  price_contains_nocase?: InputMaybe<Scalars['String']>;
  price_not_contains?: InputMaybe<Scalars['String']>;
  price_not_contains_nocase?: InputMaybe<Scalars['String']>;
  price_starts_with?: InputMaybe<Scalars['String']>;
  price_starts_with_nocase?: InputMaybe<Scalars['String']>;
  price_not_starts_with?: InputMaybe<Scalars['String']>;
  price_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  price_ends_with?: InputMaybe<Scalars['String']>;
  price_ends_with_nocase?: InputMaybe<Scalars['String']>;
  price_not_ends_with?: InputMaybe<Scalars['String']>;
  price_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  price_?: InputMaybe<OfferPrice_filter>;
  availableAmount?: InputMaybe<Scalars['BigDecimal']>;
  availableAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  availableAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  availableAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  availableAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  availableAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  availableAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  availableAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  purchases?: InputMaybe<Array<Scalars['String']>>;
  purchases_not?: InputMaybe<Array<Scalars['String']>>;
  purchases_contains?: InputMaybe<Array<Scalars['String']>>;
  purchases_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  purchases_not_contains?: InputMaybe<Array<Scalars['String']>>;
  purchases_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  purchases_?: InputMaybe<Purchase_filter>;
  purchaseCount?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_not?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_gt?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_lt?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_gte?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_lte?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  purchaseCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  buyer?: InputMaybe<Scalars['String']>;
  buyer_not?: InputMaybe<Scalars['String']>;
  buyer_gt?: InputMaybe<Scalars['String']>;
  buyer_lt?: InputMaybe<Scalars['String']>;
  buyer_gte?: InputMaybe<Scalars['String']>;
  buyer_lte?: InputMaybe<Scalars['String']>;
  buyer_in?: InputMaybe<Array<Scalars['String']>>;
  buyer_not_in?: InputMaybe<Array<Scalars['String']>>;
  buyer_contains?: InputMaybe<Scalars['String']>;
  buyer_contains_nocase?: InputMaybe<Scalars['String']>;
  buyer_not_contains?: InputMaybe<Scalars['String']>;
  buyer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  buyer_starts_with?: InputMaybe<Scalars['String']>;
  buyer_starts_with_nocase?: InputMaybe<Scalars['String']>;
  buyer_not_starts_with?: InputMaybe<Scalars['String']>;
  buyer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  buyer_ends_with?: InputMaybe<Scalars['String']>;
  buyer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  buyer_not_ends_with?: InputMaybe<Scalars['String']>;
  buyer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  buyer_?: InputMaybe<Account_filter>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  removedAtBlock?: InputMaybe<Scalars['BigInt']>;
  removedAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  removedAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  removedAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  removedAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  removedAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  removedAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  removedAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  removedAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  removedAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  removedAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  removedAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  removedAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  removedAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  removedAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  removedAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Offer_orderBy =
  | 'id'
  | 'seller'
  | 'offerToken'
  | 'buyerToken'
  | 'prices'
  | 'price'
  | 'availableAmount'
  | 'purchases'
  | 'purchaseCount'
  | 'buyer'
  | 'createdAtBlock'
  | 'createdAtTimestamp'
  | 'removedAtBlock'
  | 'removedAtTimestamp';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Purchase = {
  id: Scalars['ID'];
  /**  Offer entity  */
  offer: Offer;
  /**  Buyer 0x  */
  buyer: Account;
  /**  Price  */
  price: Scalars['BigDecimal'];
  /**  Quantity  */
  quantity: Scalars['BigDecimal'];
  /**  Creation block  */
  createdAtBlock: Scalars['BigInt'];
  /**  Creation timestamp  */
  createdAtTimestamp: Scalars['BigInt'];
};

export type Purchase_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  offer?: InputMaybe<Scalars['String']>;
  offer_not?: InputMaybe<Scalars['String']>;
  offer_gt?: InputMaybe<Scalars['String']>;
  offer_lt?: InputMaybe<Scalars['String']>;
  offer_gte?: InputMaybe<Scalars['String']>;
  offer_lte?: InputMaybe<Scalars['String']>;
  offer_in?: InputMaybe<Array<Scalars['String']>>;
  offer_not_in?: InputMaybe<Array<Scalars['String']>>;
  offer_contains?: InputMaybe<Scalars['String']>;
  offer_contains_nocase?: InputMaybe<Scalars['String']>;
  offer_not_contains?: InputMaybe<Scalars['String']>;
  offer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  offer_starts_with?: InputMaybe<Scalars['String']>;
  offer_starts_with_nocase?: InputMaybe<Scalars['String']>;
  offer_not_starts_with?: InputMaybe<Scalars['String']>;
  offer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  offer_ends_with?: InputMaybe<Scalars['String']>;
  offer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  offer_not_ends_with?: InputMaybe<Scalars['String']>;
  offer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  offer_?: InputMaybe<Offer_filter>;
  buyer?: InputMaybe<Scalars['String']>;
  buyer_not?: InputMaybe<Scalars['String']>;
  buyer_gt?: InputMaybe<Scalars['String']>;
  buyer_lt?: InputMaybe<Scalars['String']>;
  buyer_gte?: InputMaybe<Scalars['String']>;
  buyer_lte?: InputMaybe<Scalars['String']>;
  buyer_in?: InputMaybe<Array<Scalars['String']>>;
  buyer_not_in?: InputMaybe<Array<Scalars['String']>>;
  buyer_contains?: InputMaybe<Scalars['String']>;
  buyer_contains_nocase?: InputMaybe<Scalars['String']>;
  buyer_not_contains?: InputMaybe<Scalars['String']>;
  buyer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  buyer_starts_with?: InputMaybe<Scalars['String']>;
  buyer_starts_with_nocase?: InputMaybe<Scalars['String']>;
  buyer_not_starts_with?: InputMaybe<Scalars['String']>;
  buyer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  buyer_ends_with?: InputMaybe<Scalars['String']>;
  buyer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  buyer_not_ends_with?: InputMaybe<Scalars['String']>;
  buyer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  buyer_?: InputMaybe<Account_filter>;
  price?: InputMaybe<Scalars['BigDecimal']>;
  price_not?: InputMaybe<Scalars['BigDecimal']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']>;
  price_lt?: InputMaybe<Scalars['BigDecimal']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  quantity?: InputMaybe<Scalars['BigDecimal']>;
  quantity_not?: InputMaybe<Scalars['BigDecimal']>;
  quantity_gt?: InputMaybe<Scalars['BigDecimal']>;
  quantity_lt?: InputMaybe<Scalars['BigDecimal']>;
  quantity_gte?: InputMaybe<Scalars['BigDecimal']>;
  quantity_lte?: InputMaybe<Scalars['BigDecimal']>;
  quantity_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  quantity_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Purchase_orderBy =
  | 'id'
  | 'offer'
  | 'buyer'
  | 'price'
  | 'quantity'
  | 'createdAtBlock'
  | 'createdAtTimestamp';

export type Query = {
  account?: Maybe<Account>;
  accounts: Array<Account>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  offerPrice?: Maybe<OfferPrice>;
  offerPrices: Array<OfferPrice>;
  purchase?: Maybe<Purchase>;
  purchases: Array<Purchase>;
  offer?: Maybe<Offer>;
  offers: Array<Offer>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryaccountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Account_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryofferPriceArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryofferPricesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OfferPrice_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OfferPrice_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypurchaseArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Purchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Purchase_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryofferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryoffersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Offer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Offer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  account?: Maybe<Account>;
  accounts: Array<Account>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  offerPrice?: Maybe<OfferPrice>;
  offerPrices: Array<OfferPrice>;
  purchase?: Maybe<Purchase>;
  purchases: Array<Purchase>;
  offer?: Maybe<Offer>;
  offers: Array<Offer>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionaccountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Account_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionofferPriceArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionofferPricesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OfferPrice_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OfferPrice_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpurchaseArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Purchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Purchase_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionofferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionoffersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Offer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Offer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

/**  Token entity  */
export type Token = {
  id: Scalars['ID'];
  /**  Token address  */
  address: Scalars['Bytes'];
  /**  Array of offers  */
  offers: Array<Offer>;
  /**  Array of purchases  */
  purchases: Array<Purchase>;
  /**  Purchase count  */
  purchaseCount: Scalars['BigInt'];
  /**  Dollars volume  */
  dollarsVolume: Scalars['BigDecimal'];
  /**  Offer count  */
  offerCount: Scalars['BigInt'];
  /**  TokenType: 0:NOWL|1:REALTOKEN|2:ERC20PERMIT|3:ERC20NOPERMIT  */
  tokenType: Scalars['Int'];
  /**  Token decimal  */
  decimals?: Maybe<Scalars['Int']>;
  /**  Token name  */
  name?: Maybe<Scalars['String']>;
  /**  Token symbol  */
  symbol?: Maybe<Scalars['String']>;
};


/**  Token entity  */
export type TokenoffersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Offer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Offer_filter>;
};


/**  Token entity  */
export type TokenpurchasesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Purchase_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Purchase_filter>;
};

export type Token_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  offers?: InputMaybe<Array<Scalars['String']>>;
  offers_not?: InputMaybe<Array<Scalars['String']>>;
  offers_contains?: InputMaybe<Array<Scalars['String']>>;
  offers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  offers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  offers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  offers_?: InputMaybe<Offer_filter>;
  purchases?: InputMaybe<Array<Scalars['String']>>;
  purchases_not?: InputMaybe<Array<Scalars['String']>>;
  purchases_contains?: InputMaybe<Array<Scalars['String']>>;
  purchases_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  purchases_not_contains?: InputMaybe<Array<Scalars['String']>>;
  purchases_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  purchases_?: InputMaybe<Purchase_filter>;
  purchaseCount?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_not?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_gt?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_lt?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_gte?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_lte?: InputMaybe<Scalars['BigInt']>;
  purchaseCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  purchaseCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dollarsVolume?: InputMaybe<Scalars['BigDecimal']>;
  dollarsVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  dollarsVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  dollarsVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  dollarsVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  dollarsVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  dollarsVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  dollarsVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  offerCount?: InputMaybe<Scalars['BigInt']>;
  offerCount_not?: InputMaybe<Scalars['BigInt']>;
  offerCount_gt?: InputMaybe<Scalars['BigInt']>;
  offerCount_lt?: InputMaybe<Scalars['BigInt']>;
  offerCount_gte?: InputMaybe<Scalars['BigInt']>;
  offerCount_lte?: InputMaybe<Scalars['BigInt']>;
  offerCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  offerCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenType?: InputMaybe<Scalars['Int']>;
  tokenType_not?: InputMaybe<Scalars['Int']>;
  tokenType_gt?: InputMaybe<Scalars['Int']>;
  tokenType_lt?: InputMaybe<Scalars['Int']>;
  tokenType_gte?: InputMaybe<Scalars['Int']>;
  tokenType_lte?: InputMaybe<Scalars['Int']>;
  tokenType_in?: InputMaybe<Array<Scalars['Int']>>;
  tokenType_not_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Token_orderBy =
  | 'id'
  | 'address'
  | 'offers'
  | 'purchases'
  | 'purchaseCount'
  | 'dollarsVolume'
  | 'offerCount'
  | 'tokenType'
  | 'decimals'
  | 'name'
  | 'symbol';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  account: InContextSdkMethod<Query['account'], QueryaccountArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Query['accounts'], QueryaccountsArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<Query['token'], QuerytokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<Query['tokens'], QuerytokensArgs, MeshContext>,
  /** null **/
  offerPrice: InContextSdkMethod<Query['offerPrice'], QueryofferPriceArgs, MeshContext>,
  /** null **/
  offerPrices: InContextSdkMethod<Query['offerPrices'], QueryofferPricesArgs, MeshContext>,
  /** null **/
  purchase: InContextSdkMethod<Query['purchase'], QuerypurchaseArgs, MeshContext>,
  /** null **/
  purchases: InContextSdkMethod<Query['purchases'], QuerypurchasesArgs, MeshContext>,
  /** null **/
  offer: InContextSdkMethod<Query['offer'], QueryofferArgs, MeshContext>,
  /** null **/
  offers: InContextSdkMethod<Query['offers'], QueryoffersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  account: InContextSdkMethod<Subscription['account'], SubscriptionaccountArgs, MeshContext>,
  /** null **/
  accounts: InContextSdkMethod<Subscription['accounts'], SubscriptionaccountsArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<Subscription['token'], SubscriptiontokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<Subscription['tokens'], SubscriptiontokensArgs, MeshContext>,
  /** null **/
  offerPrice: InContextSdkMethod<Subscription['offerPrice'], SubscriptionofferPriceArgs, MeshContext>,
  /** null **/
  offerPrices: InContextSdkMethod<Subscription['offerPrices'], SubscriptionofferPricesArgs, MeshContext>,
  /** null **/
  purchase: InContextSdkMethod<Subscription['purchase'], SubscriptionpurchaseArgs, MeshContext>,
  /** null **/
  purchases: InContextSdkMethod<Subscription['purchases'], SubscriptionpurchasesArgs, MeshContext>,
  /** null **/
  offer: InContextSdkMethod<Subscription['offer'], SubscriptionofferArgs, MeshContext>,
  /** null **/
  offers: InContextSdkMethod<Subscription['offers'], SubscriptionoffersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["yam-gnosis"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
