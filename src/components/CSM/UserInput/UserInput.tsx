import { FC, useRef, useState } from 'react';

import {
  Card,
  Container,
  Flex,
  Text,
  TextInput,
  Title,
  createStyles,
} from '@mantine/core';

const useStyles = createStyles(() => ({
  container: {
    fontSize: '1.1rem',
    lineHeight: 1.4,
    padding: '10px',
    marginBottom: '10px',
  },
  input: {
    marginBottom: '10px',
  },
}));

type AddressProps = {
  initialValue: string;
  setAccount: any;
  updateAccount: any;
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
  console.log('WARNING RENDER USER INPUT', account);
  return (
    <Container className={classes.container}>
      <Card shadow={'sm'} padding={'lg'} radius={'md'} withBorder={true}>
        <Title order={1}>{'Wallet view'}</Title>

        <TextInput
          className={classes.input}
          label={'Enter user account'}
          value={value}
          onChange={setAccountValue(
            setValue,
            setDisplayedAccount,
            setAccount,
            updateAccount
          )}
        />
        <Text ref={ref} fz={'md'} fw={700}>
          {'Selected account'}
        </Text>
        <Text ref={ref} fz={'xd'} fw={700}>
          {account}
        </Text>
      </Card>

      <Flex
        gap={'md'}
        justify={'flex-start'}
        align={'flex-start'}
        direction={'column'}
        wrap={'wrap'}
      >
        <Flex
          gap={'0'}
          justify={'flex-start'}
          align={'flex-start'}
          direction={'column'}
          wrap={'wrap'}
        ></Flex>
      </Flex>
    </Container>
  );
};
function setAccountValue(
  setValue: any,
  setDisplayedAccount: any,
  setAccount: any,
  updateAccount: any
) {
  return (event: any) => {
    setValue(event.currentTarget.value);
    if (event.currentTarget.value.length == 42) {
      console.log('WARNING USER INPUT CHANGED', event.currentTarget.value);
      setDisplayedAccount(event.currentTarget.value);
      setAccount(event.currentTarget.value);
      updateAccount(event.currentTarget.value);
    }
  };
}
