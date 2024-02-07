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

export const API_MINING_HISTORY = {
  url: (id: string) => '/api/sites/' + id + '/mining/history',
  method: 'POST',
};

export const API_MINING_EXPENSES = {
  url: (id: string) => '/api/sites/' + id + '/expenses',
  method: 'POST',
};

export const API_TREASURY = {
  url: (id: string) => '/api/sites/' + id + '/treasury',
  method: 'POST',
};

export const API_SITE = {
  url: (id: string) => '/api/sites/' + id,
  method: 'POST',
};
