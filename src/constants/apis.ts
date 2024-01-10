export const API_BITCOIN_QUOTE = {
  url: 'https://api.hashrateindex.com/graphql',
  method: 'POST',
};

export const API_BITCOIN_ORACLE = {
  url: '/api/quote/bitcoin',
  method: 'POST',
};

export const API_NETWORK_OVERVIEW = {
  url: '/api/hashrate/overview',
  method: 'POST',
};

export const API_ADMIN = {
  url: (address: string) => '/api/admin/' + address,
  method: 'POST',
};

export const API_MINING_STATE = {
  url: '/api/mining/history',
  method: 'POST',
};
