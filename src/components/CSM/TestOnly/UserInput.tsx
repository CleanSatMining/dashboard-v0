import { FC, useRef, useState } from 'react';

import {
  Container,
  Flex,
  Text,
  TextInput,
  Title,
  createStyles,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  container: {
    borderColor: theme.colors.brand,
    backgroundColor: theme.colors.brand,
    borderWidth: '2px',
    borderRadius: theme.spacing.sm,
    fontSize: '1.1rem',
    lineHeight: 1.4,
    padding: '10px',
    marginBottom: '10px',
  },
}));

type AddressProps = {
  address: string;
  setAccount: any;
};

export const AddressInput: FC<AddressProps> = ({
  address = '0x484B0C11bAfb51A74c35449d9F01573f548e7180',
  setAccount,
}) => {
  const { classes } = useStyles();
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(address);
  const [account, setDisplayedAccount] = useState(address);
  return (
    <Container className={classes.container}>
      <Title order={1}>{'This is only for test'}</Title>
      <Flex
        gap={'md'}
        justify={'flex-start'}
        align={'flex-start'}
        direction={'row'}
        wrap={'wrap'}
      >
        <TextInput
          label={'Enter user account'}
          value={value}
          onChange={setAccountValue(setValue, setDisplayedAccount, setAccount)}
        />
        <Flex
          gap={'0'}
          justify={'flex-start'}
          align={'flex-start'}
          direction={'column'}
          wrap={'wrap'}
        >
          <Text ref={ref} fz={'md'} fw={700}>
            {'Account'}
          </Text>
          <Text ref={ref} fz={'xd'} fw={700}>
            {account}
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};
function setAccountValue(
  setValue: any,
  setDisplayedAccount: any,
  setAccount: any
) {
  return (event: any) => {
    setValue(event.currentTarget.value);
    if (event.currentTarget.value.length == 42) {
      setDisplayedAccount(event.currentTarget.value);
      setAccount(event.currentTarget.value);
    }
  };
}
