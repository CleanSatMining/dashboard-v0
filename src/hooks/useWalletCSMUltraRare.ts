import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAnyContract } from 'src/utils';
import { CleanSatMiningUltraRareABI } from 'src/abis';
import { Contract } from 'ethers';
import { Metadata } from 'src/abis/types/NFT';

//const contractAddress = '0x35A666D286d9f3240238932996711FEFAbeE8d5f';
// Créez un custom hook pour récupérer les NFTs
export const useNFTs = (
  contractAddress: string, // Adresse du contrat NFT
  account: string, // L'ID du NFT que vous souhaitez récupérer
) => {
  const { provider } = useWeb3React();

  const [nftMetadata, setNftMetadata] = useState<Metadata[]>([]);
  const [nftUri, setNftUri] = useState<string>('');
  const [nftImage, setNftImage] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider || !contractAddress) {
        console.error('Web3 provider ou adresse du contrat non trouvés');
        setLoading(false);
        return;
      }
      try {
        const contract = new Contract(
          contractAddress,
          CleanSatMiningUltraRareABI,
          provider?.getSigner(),
        );

        // Obtenez le nombre total de NFTs
        setCollectionName(await contract.name());
        const balance = await contract.balanceOf(account);

        const getNFTUri = async () => {
          if (contract) {
            try {
              const uri = await contract.tokenURI(1);
              setNftUri(uri);
            } catch (error) {
              console.error(
                "Erreur lors de la récupération de l'URI du NFT :",
                error,
              );
            }
          } else {
            console.error(
              "Erreur lors de la récupération de l'URI du NFT : contract undefined",
            );
          }
        };

        // Fonction pour récupérer l'image du NFT
        const getNFTImage = async () => {
          if (nftUri) {
            try {
              const response = await fetch(nftUri);
              const data = await response.json();
              setNftImage(data.image);
            } catch (error) {
              console.error(
                "Erreur lors de la récupération de l'image du NFT :",
                error,
              );
            }
          }
        };

        // Fonction pour récupérer l'image du NFT
        const getNFTMetadata = async () => {
          if (balance && balance > 0) {
            const meta: Metadata[] = [];
            for (let index = 0; index < balance; index++) {
              const id = await contract.tokenOfOwnerByIndex(account, index);
              const uri = await contract.tokenURI(id);
              try {
                const response = await fetch(uri);
                const data: Metadata = await response.json();
                meta.push(data);
              } catch (error) {
                console.error(
                  "Erreur lors de la récupération de l'image du NFT :",
                  error,
                );
              }
            }
            setNftMetadata(meta);
          }
        };

        getNFTUri();
        getNFTImage();
        getNFTMetadata();
      } catch (error) {
        console.error('Erreur lors de la récupération des NFTs :', error);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  return { nftMetadata, collectionName, nftUri, nftImage, loading };
};

interface NFT {
  nftUri: string; // Adresse du contrat NFT
  nftImage: string; // L'ID du NFT que vous souhaitez récupérer
}

export const useWalletCleanSatMiningUltraRare = (
  contractAddress: string, // Adresse du contrat NFT
  tokenId: number, // L'ID du NFT que vous souhaitez récupérer
): NFT => {
  const { account, provider } = useWeb3React();
  const [nftUri, setNftUri] = useState<string>('');
  const [nftImage, setNftImage] = useState<string>('');

  useEffect(() => {
    const contract = getAnyContract(
      '0x35A666D286d9f3240238932996711FEFAbeE8d5f', //'0x765495Be1E0c23447163f6402D17dEbc9eCeF0E2',
      CleanSatMiningUltraRareABI,
      provider as Web3Provider,
      account,
    );
    //const contract = new web3.eth.Contract(contractAbi, contractAddress);

    // Fonction pour récupérer l'URI du NFT
    const getNFTUri = async () => {
      if (contract) {
        try {
          const uri = await contract.methods.tokenURI(tokenId).call();
          setNftUri(uri);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'URI du NFT :",
            error,
          );
        }
      } else {
        console.error(
          "Erreur lors de la récupération de l'URI du NFT : contract undefined",
        );
      }
    };

    // Fonction pour récupérer l'image du NFT
    const getNFTImage = async () => {
      if (nftUri) {
        try {
          const response = await fetch(nftUri);
          const data = await response.json();
          setNftImage(data.image);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'image du NFT :",
            error,
          );
        }
      }
    };

    getNFTUri();
    getNFTImage();
  }, [contractAddress, tokenId]);

  return {
    nftUri,
    nftImage,
  };
};
