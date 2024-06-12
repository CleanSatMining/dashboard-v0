import React from 'react';
import {
  Menu,
  Button,
  Text,
  NumberInput,
  useMantineTheme,
} from '@mantine/core';

import { useTranslation } from 'react-i18next';
import {
  IconChevronUp,
  IconChevronDown,
  IconSearch,
} from '@tabler/icons-react';
import { DateInput, DateValue } from '@mantine/dates';
import { PredefinedPeriods } from './Types';
import { FIRST_OF_MAY, getCalendarIcon } from './Utils';
import { getDateYesterday } from 'src/utils/date';

interface TimeSelectMenuProps {
  menuOpened: boolean;
  closeMenu: () => void;
  openMenu: () => void;
  menuLabel: string;
  numberInput: number | '';
  setNumberInput: React.Dispatch<React.SetStateAction<number | ''>>;
  startDateInput: Date | null;
  setStartDateInput: React.Dispatch<React.SetStateAction<Date | null>>;
  endDateInput: Date | null;
  setEndDateInput: React.Dispatch<React.SetStateAction<Date | null>>;
  startDateError: boolean;
  setStartDateError: React.Dispatch<React.SetStateAction<boolean>>;
  IconMenu: React.ReactNode;
  handlePredefinedPeriodClick: (value: PredefinedPeriods) => void;
  handleDateRangeItemClick: () => void;
  handleNumberOfDaysClick: () => void;
}

export const TimeSelectMenu: React.FC<TimeSelectMenuProps> = ({
  menuOpened,
  closeMenu,
  openMenu,
  menuLabel,
  numberInput,
  setNumberInput,
  startDateInput,
  setStartDateInput,
  endDateInput,
  setEndDateInput,
  startDateError,
  setStartDateError,
  IconMenu,
  handlePredefinedPeriodClick,
  handleDateRangeItemClick,
  handleNumberOfDaysClick,
}) => {
  const theme = useMantineTheme();
  const { t } = useTranslation('timeframe', { keyPrefix: 'menu' });

  return (
    <Menu
      shadow={'md'}
      width={200}
      opened={menuOpened}
      closeOnClickOutside={true}
    >
      <Menu.Target>
        <Button
          h={30}
          radius={'md'}
          onClick={() => {
            menuOpened ? closeMenu() : openMenu();
          }}
          leftIcon={IconMenu}
          rightIcon={
            menuOpened ? (
              <IconChevronUp size={20}></IconChevronUp>
            ) : (
              <IconChevronDown size={20}></IconChevronDown>
            )
          }
        >
          {menuLabel}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('predefinedPeriods')}</Menu.Label>
        {Object.values(PredefinedPeriods).map((period) => (
          <Menu.Item
            key={period}
            icon={getCalendarIcon(period, 14)}
            onClick={() => handlePredefinedPeriodClick(period)}
            color={
              menuLabel === t(period)
                ? theme.colorScheme === 'light'
                  ? 'lime'
                  : 'brand'
                : undefined
            }
          >
            {t(period)}
          </Menu.Item>
        ))}

        <Menu.Divider />

        <Menu.Label>
          {
            <Text
              color={
                menuLabel === t('customDate')
                  ? theme.colorScheme === 'light'
                    ? 'lime'
                    : 'brand'
                  : undefined
              }
            >
              {t('byDate')}
            </Text>
          }
        </Menu.Label>
        <Menu.Item
          icon={
            <Text fz={'xs'} w={'16px'}>
              {t('from')}
            </Text>
          }
          sx={{ padding: '3px' }}
        >
          <DateInput
            value={startDateInput}
            onChange={(d: DateValue) => {
              setStartDateError(false);
              setStartDateInput(d);
            }}
            minDate={new Date(FIRST_OF_MAY)}
            maxDate={endDateInput ?? getDateYesterday()}
            valueFormat={'DD/MM/YYYY'}
            size={'xs'}
            placeholder={t('startDate')}
            maw={400}
            mx={'auto'}
            clearable={true}
            error={startDateError ? t('errorStartDate') : null} //'Please select a start date'
          />
        </Menu.Item>
        <Menu.Item
          icon={
            <Text fz={'xs'} w={'16px'}>
              {t('to')}
            </Text>
          }
          sx={{ padding: '3px' }}
        >
          <DateInput
            value={endDateInput}
            onChange={setEndDateInput}
            minDate={startDateInput ?? new Date(FIRST_OF_MAY)}
            maxDate={new Date()}
            valueFormat={'DD/MM/YYYY'}
            size={'xs'}
            placeholder={t('endDate')}
            maw={400}
            mx={'auto'}
            clearable={true}
          />
        </Menu.Item>
        <Menu.Item
          icon={<IconSearch size={14} />}
          sx={{
            margin: '5px 0 10px 0',
            padding: '3px',
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
            borderColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[4]
                : theme.colors.gray[4],
            borderStyle: 'solid',
            borderWidth: '1px',
          }}
        >
          <Text h={'lg'} onClick={() => handleDateRangeItemClick()}>
            {t('update')}
          </Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>
          <Text
            color={
              menuLabel === t('customDuration')
                ? theme.colorScheme === 'light'
                  ? 'lime'
                  : 'brand'
                : undefined
            }
          >
            {t('byDuration')}
          </Text>
        </Menu.Label>
        <Menu.Item sx={{ padding: '3px' }}>
          <NumberInput
            size={'xs'}
            defaultValue={7}
            placeholder={'Nombre de jours'}
            max={185}
            step={1}
            min={1}
            precision={0}
            value={numberInput}
            onChange={setNumberInput}
          />
        </Menu.Item>
        <Menu.Item
          icon={<IconSearch size={14} />}
          sx={{
            margin: '5px 0 3px 0',
            padding: '3px',
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
            borderColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[4]
                : theme.colors.gray[4],
            borderStyle: 'solid',
            borderWidth: '1px',
          }}
        >
          <Text h={'lg'} onClick={() => handleNumberOfDaysClick()}>
            {t('update')}
          </Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
