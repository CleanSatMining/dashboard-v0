import { FC, forwardRef, useRef, useState } from 'react';

import {
  NumberInput,
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

type BTCPriceProps = {
  initialValue: number;
  setBitcoinPrice: React.Dispatch<React.SetStateAction<number>>;
  updatePrice: (p: number) => void;
};

export const BitcoinPriceInput: FC<BTCPriceProps> = ({
  initialValue: price = 40000,
  setBitcoinPrice: setAccount,
  updatePrice: updateAccount,
}) => {
  const { classes } = useStyles();
  const [value, setValue] = useState<number | ''>(price);
  const [account, setDisplayedAccount] = useState(price);
  const isMobile = useMediaQuery('(max-width: 36em)');
  // console.log('WARNING RENDER USER INPUT', account);
  return (
    <Container className={classes.container}>
      <NumberInput
        label={'Price'}
        placeholder={'Enter your custom price'}
        error={value !== account}
        value={value}
        onChange={setValue}
        size={isMobile ? 'xs' : 'sm'}
      />

      <Space h={10}></Space>
    </Container>
  );
};
