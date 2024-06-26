import { FC } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  Flex,
  Text,
  Title,
  createStyles,
  TitleOrder,
  HoverCard,
} from '@mantine/core';
import { calcRem } from 'src/utils/style';

const useStyles = createStyles((theme) => ({
  selected: {
    display: 'flex',
    height: calcRem(100),
    width: '33%',
    padding: '7px',
    borderStyle: 'solid',
    borderWidth: '3px',
    borderRadius: theme.radius.lg,
    //borderColor: isSelected ? 'white' : 'transparent',
  },
  container: {
    // position: 'relative',
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
    //backgroundColor: backgroundColor,
    // padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    '&:hover': {
      //backgroundColor: theme.fn.darken(backgroundColor, 0.4),
      cursor: 'pointer',
    },
  },
  info: {
    position: 'absolute',
    top: '0',
    marginRight: '8px',
    marginTop: '5px',
    display: 'flex',
    justifyContent: 'end',
    width: '100%',
  },
}));

type InfoTextProps = {
  text: string;
  tooltipText?: string;
  color?: string;
  iconColor?: string;
  fw?: number;
  fs?: string;
  fz?: string;
  iconeSize?: number;
  width?: number;
  weight?: number;
};

export const InfoText: FC<InfoTextProps> = ({
  text,
  tooltipText,
  color,
  fw,
  fs,
  fz,
  iconColor,
  iconeSize,
  width,
  weight,
}) => {
  const { classes } = useStyles();
  const size = iconeSize ?? 16;
  const iconColorCalc = iconColor
    ? iconColor
    : color === 'dimmed'
      ? 'gray'
      : color === 'yellow'
        ? '#f08c00'
        : color;
  const cardWidth = width ?? 400;
  return (
    <HoverCard
      width={cardWidth}
      shadow={'md'}
      disabled={tooltipText ? false : true}
    >
      <HoverCard.Target>
        <Flex
          direction={'row'}
          align={'center'}
          gap={'5px'}
          className={classes.container}
        >
          <Text color={color} fw={fw} fs={fs} fz={fz} weight={weight}>
            {text}
          </Text>
          <IconInfoCircle size={size} color={iconColorCalc} />
        </Flex>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size={'sm'}>{tooltipText}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

type InfoTitleProps = {
  title: string | undefined;
  order: TitleOrder;
  tooltipText?: string;
  color?: string;
  iconColor?: string;
  iconeSize?: number;
  icon?: boolean;
  width?: number;
};

export const InfoTitle: FC<InfoTitleProps> = ({
  title,
  order,
  tooltipText,
  color,
  iconColor,
  iconeSize,
  icon,
  width,
}) => {
  const { classes } = useStyles();
  const size = iconeSize ?? 20;
  const showIcon = icon ?? true;
  //const iconColor = color === 'dimmed' ? 'gray' : color;
  const iconColorCalc = iconColor
    ? iconColor
    : color === 'dimmed'
      ? 'gray'
      : color === 'yellow'
        ? '#f08c00'
        : color;
  const cardWidth = width ?? 400;
  return (
    <HoverCard
      width={cardWidth}
      shadow={'md'}
      disabled={tooltipText ? false : true}
    >
      <HoverCard.Target>
        <Flex
          direction={'row'}
          align={'center'}
          gap={'5px'}
          className={classes.container}
        >
          <Title order={order} color={color}>
            {title}
          </Title>
          {showIcon && <IconInfoCircle size={size} color={iconColorCalc} />}
        </Flex>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size={'sm'}>{tooltipText}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
