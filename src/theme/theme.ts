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
      '#6ab04c', //116B0B
      '#6ab04c', //1B9A11
      '#6ab04c', //1BAB11
      '#6ab04c', //23BE17
      '#6ab04c', //26EB17
      '#6ab04c', //28F719
      '#6ab04c', //116B0B
      '#333',
      '#6ab04c', //116B0B
      '#B7CC41', //28F719
    ],
  },
  primaryColor: 'brand',
  defaultGradient: { deg: 90, from: '#B7CC41', to: '#6ab04c' },
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
