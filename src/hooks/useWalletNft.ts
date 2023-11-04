import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
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

  const [metadata, setNftMetadata] = useState<Metadata[]>([]);
  const [balance, setNftBalance] = useState<number>(0);
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

        // Obtenez le nom du NFT
        setCollectionName(await contract.name());

        const b = await contract.balanceOf(account);

        const getNftBalance = async () => {
          if (contract) {
            setNftBalance(await contract.balanceOf(account));
          }
        };

        // Fonction pour récupérer l'image du NFT
        const getNFTMetadata = async () => {
          if (b && b > 0) {
            const meta: Metadata[] = [];
            for (let index = 0; index < b; index++) {
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
            setNftBalance(b);
          }
        };

        //getNftBalance();
        getNFTMetadata();
        //getNftBalance();
      } catch (error) {
        console.error('Erreur lors de la récupération des NFTs :', error);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [account]);

  return { balance, metadata, collectionName, loading };
};
