import { FC, forwardRef, useRef, useState } from 'react';

import {
  Autocomplete,
  Container,
  Flex,
  Group,
  MantineColor,
  SelectItemProps,
  Text,
  createStyles,
  Space,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconAt } from '@tabler/icons';

const useStyles = createStyles(() => ({
  container: {
    fontSize: '1.1rem',
    lineHeight: 1.4,
    padding: '0px',
    marginBottom: '10px',
    width: '100%',
    margin: 0,
  },
  input: {
    marginBottom: '10px',
  },
}));

type AddressProps = {
  initialValue: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  updateAccount: (p: string) => void;
};

export const AddressInput: FC<AddressProps> = ({
  initialValue: address = '0xC78f0e746A2e6248eE6D57828985D7fD8d6B33B0',
  setAccount,
  updateAccount,
}) => {
  const { classes } = useStyles();
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(address);
  const [account, setDisplayedAccount] = useState(address);
  const isMobile = useMediaQuery('(max-width: 36em)');
  // console.log('WARNING RENDER USER INPUT', account);
  return (
    <Container className={classes.container}>
      <Autocomplete
        label={'Wallet'}
        placeholder={'Enter your custom address or select one'}
        itemComponent={AutoCompleteItem}
        data={data}
        error={value !== account}
        value={value}
        icon={<IconAt />}
        filter={(value, item) =>
          item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.label.toLowerCase().includes(value.toLowerCase().trim())
        }
        onChange={setAccountAddress(
          setValue,
          setDisplayedAccount,
          setAccount,
          updateAccount,
        )}
        size={isMobile ? 'xs' : 'sm'}
      />
      {(value !== account || getLabel(account)) && (
        <Flex
          gap={'0'}
          justify={'center'}
          align={'center'}
          direction={'column'}
          wrap={'wrap'}
        >
          {getLabel(account) && (
            <Text fz={14} fw={500} color={'brand'}>
              {getLabel(account)}
            </Text>
          )}
          {value !== account && (
            <Text ref={ref} fz={isMobile ? 10 : 14} fw={500} color={'brand'}>
              {account}
            </Text>
          )}
        </Flex>
      )}
      <Space h={10}></Space>
    </Container>
  );
};

function setAccountAddress(
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setDisplayedAccount: React.Dispatch<React.SetStateAction<string>>,
  setAccount: React.Dispatch<React.SetStateAction<string>>,
  updateAccount: (p: string) => void,
) {
  return (address: string) => {
    setValue(address);
    if (
      address.length == 42 &&
      address.startsWith('0x') &&
      onlyLettersAndNumbers(address)
    ) {
      // console.log('WARNING USER INPUT CHANGED', event.currentTarget.value);
      setDisplayedAccount(address);
      setAccount(address);
      updateAccount(address);
    }
  };
}

function getLabel(address: string) {
  return addressList.find((a) => a.address === address)?.label;
}

function onlyLettersAndNumbers(str: string) {
  return /^[A-Za-z0-9]*$/.test(str);
}

const addressList = [
  {
    label: 'CSM SA',
    address: '0xC78f0e746A2e6248eE6D57828985D7fD8d6B33B0',
  },

  {
    label: 'User anonyme 1',
    address: '0x484B0C11bAfb51A74c35449d9F01573f548e7180',
  },
  {
    label: 'User anonyme 2',
    address: '0x80C733Ea02AC59024FAfb4303a7D1d6aEeF8dd4A',
  },
  {
    label: 'User anonyme 3',
    address: '0x0969E145C6B1C3455c2Bd856F8326994418b4e3B',
  },
];

const data = addressList.map((item) => ({ ...item, value: item.address }));

interface ItemProps extends SelectItemProps {
  color: MantineColor;
  address: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap={true}>
        <div>
          <Text>{label}</Text>
          <Text size={'xs'} color={'dimmed'}>
            {value}
          </Text>
        </div>
      </Group>
    </div>
  ),
);
AutoCompleteItem.displayName = 'AutoCompleteItem';
