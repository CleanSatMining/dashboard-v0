import { FC, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, SegmentedControl } from '@mantine/core';
import { FilterStatus, FilterSite } from 'src/types/mining/Site';
import { useMediaQuery } from '@mantine/hooks';
type FilterProps = {
  ownerFilter: { value: string; setValue: Dispatch<SetStateAction<string>> };
  stateFilter: { value: string; setValue: Dispatch<SetStateAction<string>> };
};

const _Filters: FC<FilterProps> = ({ ownerFilter, stateFilter }) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('menu', { keyPrefix: 'filter' });
  return (
    <Flex
      justify={'flex-start'}
      align={'center'}
      direction={'row'}
      wrap={'wrap'}
      gap={'md'}
      sx={{ marginBottom: '10px' }}
    >
      <SegmentedControl
        radius={'md'}
        size={isMobile ? 'xs' : 'sm'}
        color={'brand'}
        value={ownerFilter.value}
        onChange={ownerFilter.setValue}
        data={[
          { label: t('all-sites'), value: FilterSite.all.toString() },
          { label: t('my-sites'), value: FilterSite.my.toString() },
        ]}
      />
      <SegmentedControl
        radius={'md'}
        color={'brand'}
        size={isMobile ? 'xs' : 'sm'}
        value={stateFilter.value}
        onChange={stateFilter.setValue}
        data={[
          { label: t('all-status'), value: FilterStatus.all.toString() },
          { label: t('active-status'), value: FilterStatus.active.toString() },
          {
            label: t('inactive-status'),
            value: FilterStatus.inactive.toString(),
          },
        ]}
      />
    </Flex>
  );
};

export const Filters = _Filters;
