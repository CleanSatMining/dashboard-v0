import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Group, MantineSize, Text, Title } from '@mantine/core';
import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Offer } from 'src/types/offer/Offer';
import { Table } from '../../Table';
import { BuyActionsWithPermit } from '../BuyActions';
import { MarketSubRow } from '../MarketSubRow';
import { useRefreshOffers } from 'src/hooks/offers/useRefreshOffers';
import { useTypedOffers } from 'src/hooks/offers/useTypedOffers';
import { OFFERS_TYPE, useRightTableColumn } from 'src/hooks/useRightTableColumns';
import { selectPrivateOffers } from 'src/store/features/interface/interfaceSelector';
import { useSelector } from 'react-redux';
import { MarketSort } from '../MarketSort/MarketSort';

export const MarketTablePrivate: FC = () => {
  
  const { refreshOffers, offersIsLoading } = useRefreshOffers(false);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'offer-id', desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const privateOffers = useSelector(selectPrivateOffers);
  const { offers, sellCount, buyCount, exchangeCount } = useTypedOffers(privateOffers)
  const columns = useRightTableColumn(OFFERS_TYPE.PRIVATE);

  const table = useReactTable({
    data: offers,
    columns: columns,
    state: { sorting, pagination, expanded },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: { colSpan: 16 },
  });

  return (
    <Flex direction={"column"} gap={"sm"} mt={10}>
      <MarketSort 
        sellCount={sellCount}
        buyCount={buyCount}
        exchangeCount={exchangeCount}
      />
      <Table
        tableProps={{
          highlightOnHover: true,
          verticalSpacing: 'sm',
          horizontalSpacing: 'xs',
          sx: (theme) => ({
            border: theme.other.border(theme),
            borderRadius: theme.radius[theme.defaultRadius as MantineSize],
            borderCollapse: 'separate',
            borderSpacing: 0,
          }),
        }}
        table={table}
        tablecaptionOptions={{ refreshState: [offersIsLoading, refreshOffers], visible: true }}
        TableSubRow={MarketSubRow}
      />
    </Flex>
  );
};