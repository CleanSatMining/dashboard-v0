import { MantineTheme, MantineThemeOverride, ModalProps } from '@mantine/core';

export const modalStyles: ModalProps['styles'] = {
  header: { justifyContent: 'center' },
  body: {
    padding: '1rem',
    width: 'auto',
    maxWidth: '700px',
    maxHeight: 'calc(100vh - (3vh * 2))',
    overflowY: 'scroll',
  },
  root: { zIndex: 10 },
  overlay: { zIndex: 10 },
  inner: { zIndex: 10 },
  content: {
    overflowY: 'unset !important' as 'unset',
    maxHeight: 'calc(100vh - (3vh * 2)) !important',
  },
};

export const theme: MantineThemeOverride = {
  colors: {
    brand: [
      '#1C730F', //116B0B
      '#228A12', //1B9A11
      '#249113', //1BAB11
      '#279E15', //23BE17
      '#2CB317', //26EB17
      '#279E15', //28F719
      '#279E15', //116B0B
      '#333',
      '#279E15', //116B0B
      '#279E15', //28F719
    ],
  },
  primaryColor: 'brand',
  defaultGradient: { deg: 90, from: '#1EA614', to: '#20BD16' },
  defaultRadius: 'md',
  cursorType: 'pointer',
  components: {
    ActionIcon: { defaultProps: { variant: 'filled' } },
  },
  other: {
    border: (theme: MantineTheme) =>
      `thin solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
  },
};
