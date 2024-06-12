import React from 'react';
import {
  Drawer,
  Button,
  Text,
  NumberInput,
  Group,
  NavLink,
  Box,
  useMantineTheme,
  Space,
} from '@mantine/core';

import { useTranslation } from 'react-i18next';
import {
  IconCalendar,
  IconCalendarTime,
  IconAdjustments,
} from '@tabler/icons-react';
import { DateInput, DateValue } from '@mantine/dates';
import { PredefinedPeriods } from './Types';
import { FIRST_OF_MAY, getCalendarIcon } from './Utils';
import { getDateYesterday } from 'src/utils/date';

import { IconChevronRight, IconActivity, IconBolt } from '@tabler/icons-react';

interface TimeSelectDrawerProps {
  drawerOpened: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
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

export const TimeSelectDrawer: React.FC<TimeSelectDrawerProps> = ({
  drawerOpened,
  closeDrawer,
  openDrawer,
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
    <>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={'Durée à afficher'}
        size={250}
        padding={10}
      >
        <Box>
          <NavLink
            label={
              <Text
                color={
                  menuLabel !== t('customDuration') &&
                  menuLabel !== t('customDate')
                    ? theme.colorScheme === 'light'
                      ? 'white'
                      : undefined
                    : 'dimmed'
                }
              >
                {t('predefinedPeriods')}
              </Text>
            }
            icon={
              <IconBolt
                color={getPredifinedMenuColor()}
                size={'1rem'}
                stroke={1.5}
              />
            }
            childrenOffset={16}
            active={
              menuLabel !== t('customDuration') && menuLabel !== t('customDate')
            }
            variant={'light'}
            defaultOpened={
              menuLabel !== t('customDuration') && menuLabel !== t('customDate')
            }
          >
            {Object.values(PredefinedPeriods).map(
              (
                period, // PredefinedPeriods.All is an array of predefined periods
              ) => (
                <NavLink
                  key={period}
                  label={t(period)}
                  icon={getCalendarIcon(period, '1rem', 1.5)}
                  onClick={() => handlePredefinedPeriodClick(period)}
                  active={menuLabel === t(period)}
                  variant={'subtle'}
                />
              ),
            )}
          </NavLink>
          <NavLink
            label={
              <Text
                color={
                  menuLabel === t('customDate')
                    ? theme.colorScheme === 'light'
                      ? 'white'
                      : undefined
                    : 'dimmed'
                }
              >
                {t('byDate')}
              </Text>
            }
            icon={
              <IconCalendar
                color={
                  menuLabel === t('customDate')
                    ? theme.colorScheme === 'light'
                      ? 'white'
                      : undefined
                    : undefined
                }
                size={'1rem'}
                stroke={1.5}
              />
            }
            childrenOffset={16}
            active={menuLabel === t('customDate')}
            variant={'light'}
            defaultOpened={menuLabel === t('customDate')}
          >
            <Space h={5}></Space>
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
            <Space h={10}></Space>
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
            <NavLink
              label={t('update')}
              icon={<IconActivity size={'1rem'} stroke={1.5} />}
              rightSection={<IconChevronRight size={'0.8rem'} stroke={1.5} />}
              variant={'subtle'}
              active={menuLabel === t('customDate')}
              onClick={() => handleDateRangeItemClick()}
            />
          </NavLink>
          <NavLink
            label={
              <Text
                color={
                  menuLabel === t('customDuration')
                    ? theme.colorScheme === 'light'
                      ? 'white'
                      : undefined
                    : 'dimmed'
                }
              >
                {t('byDuration')}
              </Text>
            }
            icon={
              <IconCalendarTime
                color={
                  menuLabel === t('customDuration')
                    ? theme.colorScheme === 'light'
                      ? 'white'
                      : undefined
                    : undefined
                }
                size={'1rem'}
                stroke={1.5}
              />
            }
            childrenOffset={16}
            active={menuLabel === t('customDuration')}
            variant={'light'}
            defaultOpened={menuLabel === t('customDuration')}
          >
            <Space h={5}></Space>
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
            <NavLink
              label={t('update')}
              icon={<IconActivity size={'1rem'} stroke={1.5} />}
              rightSection={<IconChevronRight size={'0.8rem'} stroke={1.5} />}
              variant={'subtle'}
              onClick={() => handleNumberOfDaysClick()}
              active={menuLabel === t('customDuration')}
            />
          </NavLink>
        </Box>
      </Drawer>

      <Group position={'center'}>
        <Button
          h={30}
          radius={'md'}
          onClick={openDrawer}
          leftIcon={IconMenu}
          rightIcon={<IconAdjustments size={20}></IconAdjustments>}
        >
          {menuLabel}
        </Button>
      </Group>
    </>
  );

  function getPredifinedMenuColor(): string | undefined {
    const isSelected =
      menuLabel !== t('customDuration') && menuLabel !== t('customDate');
    const isThemeLight = theme.colorScheme === 'light';
    return isSelected ? (isThemeLight ? 'white' : undefined) : undefined;
  }
};
