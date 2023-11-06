import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

//const contractAddress = '0x35A666D286d9f3240238932996711FEFAbeE8d5f';
// Créez un custom hook pour récupérer les NFTs
export const useAddERC20ToWallet = (
  tokenAddress: string, // Adresse du contrat NFT
  tokenSymbol: string,
  tokenDecimals: string,
  tokenImageURL: string,
  account: string,
) => {
  const { provider } = useWeb3React();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (provider) {
        try {
          // Créer l'objet de données pour l'ajout du token
          const tokenData = {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImageURL,
            },
          };

          // Demander à MetaMask d'ajouter le token
          const result = await provider.send('wallet_watchAsset', [tokenData]);

          if (result) {
            console.log(`Token ${tokenSymbol} added to MetaMask.`);
          } else {
            console.error('Failed to add token to MetaMask.');
          }
        } catch (error) {
          console.error(`Error adding token to MetaMask: ${error}`);
        }
      } else {
        console.error('MetaMask is not installed or not detected.');
      }
      setLoading(false);
    };

    fetchNFTs();
  }, [account, tokenAddress]);

  return { loading };
};

export const useAddERC721ToWallet = (
  nftContractAddress: string,
  nftTokenId: number,
  nftImageURL: string,
  account: string,
) => {
  const { provider } = useWeb3React();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (provider) {
        try {
          // Créer l'objet de données pour l'ajout du token
          const nftData = {
            type: 'ERC721',
            options: {
              address: nftContractAddress,
              tokenId: nftTokenId,
              image: nftImageURL,
            },
          };

          // Demandez à MetaMask d'ajouter le NFT
          const result = await provider.send('wallet_watchAsset', [nftData]);
          if (result) {
            console.log(`NFT with tokenId ${nftTokenId} added to MetaMask.`);
          } else {
            console.error('Failed to add NFT to MetaMask.');
          }
        } catch (error) {
          console.error(`Error adding NFT to MetaMask: ${error}`);
        }
      } else {
        console.error('MetaMask is not installed or not detected.');
      }

      setLoading(false);
    };

    fetchNFTs();
  }, [account]);

  return { loading };
};
