import { useState } from 'react';
import { Flex, FileButton, Button, Group, Text } from '@mantine/core';

import Papa from 'papaparse';
import { ConnectedProvider } from 'src/providers/ConnectProvider';
import { SiteID, SITES } from 'src/constants/csm';
import axios from 'axios';

type Token = {
  name: string;
  balance: number;
  isBalancesFetched: boolean;
};

type Customer = {
  name: string;
  firstname: string;
  email: string;
  kyc: number;
  adresses: string[];
  bitcoinAddress: string;
  token: Record<SiteID, Token>;
  isBalancesFetched: boolean;
};

enum CsvColumns {
  COL_NAME = 1,
  COL_FIRSTNAME = 2,
  COL_EMAIL = 3,
  COL_KYC = 4,
  COL_KYC_LEVEL = 5,
  COL_MTPELERIN = 6,
  COL_ADDRESS = 7,
  COL_BITCOIN = 8,
}

const API_BASE_URL = 'https://api.gnosisscan.io/api';

export const Admin = () => {
  //const { t } = useTranslation('menu', { keyPrefix: 'subMenuAdmin' });
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Customer[]>([]);

  const handleData = () => {
    console.log('DATA CSV', file, JSON.stringify(data, null, 4));
  };

  const handleParse = () => {
    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      console.log('TARGET', target === undefined);
      if (target && target.result) {
        const dd = parseCSV(target.result as string);
        setData(dd);
        console.log('PARSE CSV', file, JSON.stringify(dd, null, 4));
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const handleFetchBalances = async () => {
    const updatedData = [...data]; // Copie de data

    // Fonction pour effectuer un appel fetch avec pause entre les appels
    const fetchWithDelay = async (customer: Customer) => {
      if (customer.isBalancesFetched) return customer;
      for (const siteIdValue of Object.values(SiteID)) {
        const siteId = siteIdValue as SiteID;
        const token = customer.token[siteId];

        if (!token.isBalancesFetched) {
          const addresses = customer.adresses;

          for (const address of addresses) {
            console.log('FETCH TOKEN', SITES[siteId].token.symbol);
            console.log('FETCH ADDRESS', address);
            if (address && address !== '') {
              const url = `${API_BASE_URL}?module=account&action=tokenbalance&contractaddress=${SITES[siteId].token.address}&address=${address}&tag=latest&apikey=YourApiKeyToken`;

              try {
                const response = await axios.get(url);

                if (
                  response.data &&
                  response.data.result &&
                  response.data.message === 'OK'
                ) {
                  console.log(
                    'FETCH RESULT',
                    JSON.stringify(response, null, 4),
                  );
                  token.balance =
                    token.balance + parseInt(response.data.result);
                  if (addresses[addresses.length - 1] === address)
                    token.isBalancesFetched = true;
                } else {
                  console.error(
                    'Erreur lors de la récupération du solde du token' +
                      SITES[siteId].token.symbol +
                      address +
                      JSON.stringify(response),
                  );
                  throw (
                    'Erreur lors de la récupération du solde du token' +
                    SITES[siteId].token.symbol +
                    address +
                    JSON.stringify(response)
                  );
                }
              } catch (error) {
                console.error(
                  'Erreur lors de la récupération du solde du token :' +
                    SITES[siteId].token.symbol +
                    address,
                  error,
                );
                throw error;
              }

              // Pause de 200 millisecondes entre les appels (5 appels par seconde)
              await new Promise((resolve) => setTimeout(resolve, 200));
            }
          }
        }
      }
      console.log(
        'RESOLVE FETCH',
        customer.name,
        Object.values(customer.token),
      );
      if (Object.values(customer.token).every((t) => t.balance !== null))
        customer.isBalancesFetched = true;
      return customer;
    };

    // Utilisation de Promise.all avec une limite de 5 appels par seconde
    const limit = 5;
    const promises = updatedData
      .filter((d) => d.name !== undefined)
      .map((customer, index) => {
        const delay = Math.floor(index / limit) * 1000; // Pause d'1 seconde après chaque groupe de 5 appels
        return new Promise((resolve) =>
          setTimeout(() => resolve(fetchWithDelay(customer)), delay),
        );
      });

    try {
      const updatedCustomers = await Promise.all(promises);
      setData(updatedCustomers as Customer[]); // Mettre à jour data avec les soldes mis à jour
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des soldes des tokens :',
        error,
      );
    }
  };

  const handleExportCSV = () => {
    // Créer l'en-tête CSV avec une colonne pour chaque token
    const csvHeader = [
      'Name',
      'FirstName',
      'Email',
      'KYC',
      'Address',
      'BitcoinAddress',
      ...Object.values(SiteID).map(
        (siteId) => `${SITES[siteId].token.symbol} Balance`,
      ),
    ];

    // Créer les données CSV
    const csvData = data.map((customer) => [
      customer.name,
      customer.firstname,
      customer.email,
      customer.kyc,
      customer.adresses.join('; '), // Fusionnez les adresses s'il y en a plusieurs
      customer.bitcoinAddress,
      ...Object.values(SiteID).map((siteId) => customer.token[siteId].balance), // Ajouter les soldes des tokens
    ]);

    // Créer la chaîne CSV
    const csvString = [
      csvHeader.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    // Créer le blob et le lien de téléchargement
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exported_data.csv');
    link.click();
  };

  return (
    <ConnectedProvider>
      <Flex direction={'column'} py={'xl'} style={{ flexGrow: 1 }}>
        <Group position={'center'}>
          <FileButton onChange={setFile} accept={'.csv'}>
            {(props) => <Button {...props}>{'Upload CSV'}</Button>}
          </FileButton>
          {file && (
            <>
              <Button onClick={handleParse}>{'Parse ' + file.name}</Button>
              <Button onClick={handleFetchBalances}>
                {'Fetch Balances'}
              </Button>{' '}
              <Button onClick={handleData}>{'See data'}</Button>{' '}
              <Button onClick={handleExportCSV}>{'Export CSV'}</Button>{' '}
              <Button
                onClick={() => {
                  console.log(
                    'CUSTOMER UNFETCH',
                    countCustomersWithUnfetchedBalances(data),
                  );
                }}
              >
                {'Unfetch ' + countCustomersWithUnfetchedBalances(data)}
              </Button>{' '}
            </>
          )}
        </Group>

        {file && (
          <Text size={'sm'} align={'center'} mt={'sm'}>
            {'Picked file: ' + file.name}
          </Text>
        )}
        <Text size={'sm'} align={'center'} mt={'sm'}>
          {JSON.stringify(data, null, 4)}
        </Text>
      </Flex>
    </ConnectedProvider>
  );
};

export default Admin;

function parseCSV(csvData: string): Customer[] {
  const csv = Papa.parse(csvData, { header: true });
  const customers: Customer[] = [];

  if (csv.data && csv.data.length > 0) {
    const parsedData: string[] = csv?.data as string[];

    console.log('COL', Object.keys(parsedData[1]));
    parsedData.forEach((row) => {
      console.log('ROW', Object.values(row));
      const values = Object.values(row);
      const address: string[] =
        values[CsvColumns.COL_ADDRESS] === ''
          ? [values[CsvColumns.COL_MTPELERIN]]
          : [values[CsvColumns.COL_MTPELERIN], values[CsvColumns.COL_ADDRESS]];
      const customer: Customer = {
        isBalancesFetched: false,
        name: values[CsvColumns.COL_NAME],
        firstname: values[CsvColumns.COL_FIRSTNAME],
        email: values[CsvColumns.COL_EMAIL],
        kyc: parseInt(values[CsvColumns.COL_KYC_LEVEL]),
        adresses: address,
        bitcoinAddress: values[CsvColumns.COL_BITCOIN],
        token: {
          [SiteID.alpha]: {
            name: SITES[SiteID.alpha].token.symbol,
            balance: 0,
            isBalancesFetched: false,
          },
          [SiteID.beta]: {
            name: SITES[SiteID.beta].token.symbol,
            balance: 0,
            isBalancesFetched: false,
          },
          [SiteID.gamma]: {
            name: SITES[SiteID.gamma].token.symbol,
            balance: 0,
            isBalancesFetched: false,
          },
          [SiteID.omega]: {
            name: SITES[SiteID.omega].token.symbol,
            balance: 0,
            isBalancesFetched: false,
          },
          [SiteID.delta]: {
            name: SITES[SiteID.delta].token.symbol,
            balance: 0,
            isBalancesFetched: false,
          },
        },
      };

      customers.push(customer);
    });
  }

  return customers;
}

function countCustomersWithUnfetchedBalances(customers: Customer[]): number {
  return customers.filter((customer) => !customer.isBalancesFetched).length;
}
