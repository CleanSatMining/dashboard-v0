import { FC, Dispatch, SetStateAction } from 'react';

import { Flex, SegmentedControl } from '@mantine/core';
import { FilterStatus, FilterSite } from 'src/types/mining/Site';

type FilterProps = {
  ownerFilter: { value: string; setValue: Dispatch<SetStateAction<string>> };
  stateFilter: { value: string; setValue: Dispatch<SetStateAction<string>> };
};

const _Filters: FC<FilterProps> = ({ ownerFilter, stateFilter }) => {
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
        color={'brand'}
        value={ownerFilter.value}
        onChange={ownerFilter.setValue}
        data={[
          { label: 'All Sites', value: FilterSite.all.toString() },
          { label: 'My Sites', value: FilterSite.my.toString() },
        ]}
      />
      <SegmentedControl
        radius={'md'}
        color={'brand'}
        value={stateFilter.value}
        onChange={stateFilter.setValue}
        data={[
          { label: 'All States', value: FilterStatus.all.toString() },
          { label: 'Active', value: FilterStatus.active.toString() },
          { label: 'Inactive', value: FilterStatus.inactive.toString() },
        ]}
      />
    </Flex>
  );
};

export const Filters = _Filters;
