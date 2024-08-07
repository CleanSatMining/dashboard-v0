export type UrlTheGraph = {
  Eth: string;
  Gnosis: string;
  Goerli: string;
};

export const UrlTheGraphToken: UrlTheGraph = {
  Eth: '',
  Gnosis:
    'https://api.studio.thegraph.com/query/78811/csm-tokens/version/latest',
  Goerli: '',
};

export const UrlTheGraphYam: UrlTheGraph = {
  Eth: '',
  Gnosis:
    'https://api.thegraph.com/subgraphs/name/clean-sat-mining-thegraph/yam-csm',
  Goerli: '',
};
