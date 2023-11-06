import { createStyles, Flex, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { openInNewTab } from 'src/utils/window';

const useStyle = createStyles((theme) => ({
  container: {
    display: 'flex',
    gap: theme.spacing.sm,
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
    borderBottomColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'start',
    '&:hover': {
      borderBottomColor: theme.colors.brand,
      cursor: 'pointer',
    },
  },
  icon: {
    '&:hover': {
      color: theme.colors.brand[5],
      cursor: 'pointer',
    },
  },
}));

interface TextUrlProps {
  url: string;
  children: React.ReactNode;
  size?: number;
}
export const TextIconLink = ({ url, children, size = 16 }: TextUrlProps) => {
  const { classes } = useStyle();

  return (
    <Flex className={classes.container} onClick={() => openInNewTab(url)}>
      <Text>{children}</Text>
      <IconExternalLink size={size} />
    </Flex>
  );
};

interface IconLinkProps {
  url: string;
  size?: number;
}
export const IconLink = ({ url, size = 16 }: IconLinkProps) => {
  const { classes } = useStyle();

  return (
    <IconExternalLink
      className={classes.icon}
      size={size}
      onClick={() => openInNewTab(url)}
    ></IconExternalLink>
  );
};
