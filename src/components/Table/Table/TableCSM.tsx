import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Table as MantineTable, createStyles } from '@mantine/core';
import { Table as ReactTable, Row, flexRender } from '@tanstack/react-table';

export type TableSubRowProps<T> = { row: Row<T> };

const useStyles = createStyles((theme) => ({
  table: {
    overflow: 'clip',
  },
  thead: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme == 'dark' ? '#1A1B1E' : '#FFFF',
    zIndex: 1,
  },
}));

type TableProps = {
  title: string | undefined;
};

export const Table: FC<TableProps> = ({ title }) => {
  const { classes } = useStyles();

  const elements: {
    name: string;
    position: number;
    symbol: string;
    mass: number;
  }[] = [
    { position: 6, mass: 12, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140, symbol: 'Ce', name: 'Cerium' },
  ];

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
    </tr>
  ));

  return (
    <MantineTable>
      <thead>
        <tr>
          <th>Element position</th>
          <th>Element name</th>
          <th>Symbol</th>
          <th>Atomic mass</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </MantineTable>
  );
};
