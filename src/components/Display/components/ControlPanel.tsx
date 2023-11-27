import React, { useState, useEffect } from 'react';
import {
  Flex,
  SegmentedControl,
  Checkbox,
  Menu,
  Button,
  Text,
  NumberInput,
} from '@mantine/core';
import { DAYS_PERIODS, filterMobile } from '../../../constants';
import { formatPeriod } from 'src/utils/format/format';
import { useTranslation } from 'react-i18next';
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarMinus,
  IconCalendarOff,
  IconCalendarPlus,
  IconCalendarStats,
  IconCalendarTime,
  IconClock,
  IconClock2,
  IconClockHour12,
  IconChevronDown,
  IconChevronUp,
  TablerIcon,
} from '@tabler/icons';
import { DateInput, DateValue } from '@mantine/dates';
import { PredefinedPeriods, INPUT_MODE } from './Types';
import {
  getTimestampFirstDayOfCurrentMonth,
  getTimestampStartOfNDaysAgo,
  getTimestampFirstDayOfNMonthsAgo,
  calculateDaysBetweenDateAndToday,
  calculateDaysBetweenDates,
  getDateYesterday,
  getTimestampLastDayOfNMonthAgo,
  getTimestampEndOfTheDay,
} from './Utils';

import { TimeRange } from './TimeRange';

interface ControlPanelProps {
  isMobile: boolean;
  period: string;
  setPeriod: React.Dispatch<React.SetStateAction<string>>;
  adminData: boolean;
  dateModeChecked: boolean;
  setDateModeChecked: React.Dispatch<React.SetStateAction<boolean>>;
  startTimestamp: number;
  setStartTimestamp: React.Dispatch<React.SetStateAction<number>>;
  endTimestamp: number;
  setEndTimestamp: React.Dispatch<React.SetStateAction<number>>;
  defaultValue: PredefinedPeriods;
}

const FIRST_OF_MAY = 1682892000000;
const ControlPanel: React.FC<ControlPanelProps> = ({
  isMobile,
  period,
  setPeriod,
  adminData,
  dateModeChecked,
  setDateModeChecked,
  startTimestamp,
  setStartTimestamp,
  endTimestamp,
  setEndTimestamp,
  defaultValue,
}) => {
  const { t } = useTranslation('timeframe', { keyPrefix: 'menu' });
  const [menuOpened, setMenuOpened] = useState(false);
  const [menuLabel, setMenuLabel] = useState<string>(t(defaultValue));
  const [numberInput, setNumberInput] = useState<number | ''>(1);
  const [startDateInput, setStartDateInput] = useState<Date | null>(null);
  const [endDateInput, setEndDateInput] = useState<Date | null>(null);
  const [startDateError, setStartDateError] = useState(false);
  const [IconMenu, setIconMenu] = useState<React.ReactNode>(
    <IconCalendar size={20}></IconCalendar>,
  );
  const dataSegmentedControl: { label: string; value: string }[] =
    fillSegmentedControl();

  const handlePredefinedPeriodClick = (value: PredefinedPeriods) => {
    console.log('handlePredefinedPeriodClick', value);
    // You can perform additional actions based on the selected predefined period if needed
    // Use a switch statement to handle specific actions based on the selected predefined period
    const today = getTimestampStartOfNDaysAgo(0);
    switch (value) {
      case PredefinedPeriods.Last24Hours:
        // Handle Last 24 Hours
        const yesterday = getTimestampStartOfNDaysAgo(1);
        setPeriod('1');
        setStartTimestamp(yesterday);
        setEndTimestamp(today);
        setIconMenu(<IconClock size={20}></IconClock>);
        break;
      case PredefinedPeriods.Last7Days:
        // Handle Last 7 Days
        setPeriod('7');
        const sevenDaysAgo = getTimestampStartOfNDaysAgo(7);
        setStartTimestamp(sevenDaysAgo);
        setEndTimestamp(today);
        setIconMenu(<IconCalendarTime size={20}></IconCalendarTime>);
        break;
      case PredefinedPeriods.Last30Days:
        // Handle Last 30 Days
        setPeriod('30');
        const thirtyDaysAgo = getTimestampStartOfNDaysAgo(30);
        setStartTimestamp(thirtyDaysAgo);
        setEndTimestamp(today);
        setIconMenu(<IconCalendarTime size={20}></IconCalendarTime>);
        break;
      case PredefinedPeriods.CurrentMonth:
        // Handle Current Month
        const firstDayOfTheMonth = getTimestampFirstDayOfCurrentMonth();
        const days = calculateDaysBetweenDateAndToday(firstDayOfTheMonth);
        setPeriod(days.toString());
        setStartTimestamp(firstDayOfTheMonth);
        setEndTimestamp(today);
        setIconMenu(<IconCalendarDue size={20}></IconCalendarDue>);
        break;
      case PredefinedPeriods.LastMonth:
        // Handle Last Month
        const firstDayOfLastMonth = getTimestampFirstDayOfNMonthsAgo(1);
        const lastDayOfLastMonth = getTimestampLastDayOfNMonthAgo(1);
        const daysInLastMonth = calculateDaysBetweenDates(
          lastDayOfLastMonth,
          firstDayOfLastMonth,
        );
        setPeriod(daysInLastMonth.toString());
        setStartTimestamp(firstDayOfLastMonth);
        setEndTimestamp(lastDayOfLastMonth);
        setIconMenu(<IconCalendarEvent size={20}></IconCalendarEvent>);
        break;
      case PredefinedPeriods.Last3Months:
        // Handle Last 3 Months
        const firstDayOfLast3Month = getTimestampFirstDayOfNMonthsAgo(3);
        const lastDayOfLast1Month = getTimestampLastDayOfNMonthAgo(1);
        const daysInLast3Month = calculateDaysBetweenDates(
          firstDayOfLast3Month,
          lastDayOfLast1Month,
        );
        setPeriod(daysInLast3Month.toString());
        setStartTimestamp(firstDayOfLast3Month);
        setEndTimestamp(lastDayOfLast1Month);
        setIconMenu(<IconCalendarPlus size={20}></IconCalendarPlus>);
        break;
      // Add cases for other predefined periods as needed
      default:
        // Handle default case
        break;
    }
    setMenuOpened(false);
    setMenuLabel(t(value));
  };

  const handleDateRangeItemClick = () => {
    // Handle click for "Valider" button in date range section
    // You can capture the selected start and end dates here
    if (startDateInput === null) {
      //display error on DateInput
      setStartDateError(true);
    } else {
      const today = getTimestampStartOfNDaysAgo(0);
      const isEndDateToday =
        endDateInput === null || endDateInput.getTime() > today;
      const endDate = isEndDateToday
        ? today
        : getTimestampEndOfTheDay(endDateInput.getTime());
      const startDate = startDateInput.getTime();
      const duration = calculateDaysBetweenDates(endDate, startDate);

      setMenuLabel(t('customDate'));
      setStartDateError(false);
      setMenuOpened(false);
      setStartTimestamp(startDate);
      setEndTimestamp(endDate);
      setPeriod(duration.toString());
      setIconMenu(<IconCalendar size={20}></IconCalendar>);
    }
  };

  const handleNumberOfDaysClick = () => {
    // Handle Last N Days
    setPeriod(numberInput.toString());
    const daysAgo = getTimestampStartOfNDaysAgo(
      numberInput === '' ? 1 : numberInput,
    );
    const today = getTimestampStartOfNDaysAgo(0);
    setStartTimestamp(daysAgo);
    setEndTimestamp(today);
    setMenuLabel(t('customDuration'));
    setMenuOpened(false);
    setIconMenu(<IconCalendarTime size={20}></IconCalendarTime>);
  };

  useEffect(() => {
    handlePredefinedPeriodClick(defaultValue);
  }, []);

  return (
    <Flex
      mih={isMobile ? 50 : 70}
      gap={'xs'}
      justify={'left'}
      align={'center'}
      direction={'row'}
      wrap={'wrap'}
    >
      <Menu
        shadow={'md'}
        width={200}
        opened={menuOpened}
        closeOnClickOutside={true}
      >
        <Menu.Target>
          <Button
            h={30}
            radius={'lg'}
            onClick={() => {
              setMenuOpened(!menuOpened);
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
          <Menu.Item
            icon={<IconClock size={14} />}
            onClick={() =>
              handlePredefinedPeriodClick(PredefinedPeriods.Last24Hours)
            }
          >
            {t(PredefinedPeriods.Last24Hours)}
          </Menu.Item>
          <Menu.Item
            icon={<IconCalendarTime size={14} />}
            onClick={() =>
              handlePredefinedPeriodClick(PredefinedPeriods.Last7Days)
            }
          >
            {t(PredefinedPeriods.Last7Days)}
          </Menu.Item>
          <Menu.Item
            icon={<IconCalendarTime size={14} />}
            onClick={() =>
              handlePredefinedPeriodClick(PredefinedPeriods.Last30Days)
            }
          >
            {t(PredefinedPeriods.Last30Days)}
          </Menu.Item>
          <Menu.Item
            icon={<IconCalendarDue size={14} />}
            onClick={() =>
              handlePredefinedPeriodClick(PredefinedPeriods.CurrentMonth)
            }
          >
            {t(PredefinedPeriods.CurrentMonth)}
          </Menu.Item>
          <Menu.Item
            icon={<IconCalendarEvent size={14} />}
            onClick={() =>
              handlePredefinedPeriodClick(PredefinedPeriods.LastMonth)
            }
          >
            {t(PredefinedPeriods.LastMonth)}
          </Menu.Item>
          <Menu.Item
            icon={<IconCalendarPlus size={14} />}
            onClick={() =>
              handlePredefinedPeriodClick(PredefinedPeriods.Last3Months)
            }
          >
            {t(PredefinedPeriods.Last3Months)}
          </Menu.Item>
          <Menu.Divider />

          <Menu.Label>{t('byDate')}</Menu.Label>
          <Menu.Item
            icon={
              <Text fz={'xs'} w={'15px'}>
                {'De'}
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
              <Text fz={'xs'} w={'15px'}>
                {'à'}
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
          <Menu.Item icon={<IconSearch size={14} />} sx={{ padding: '3px' }}>
            <Button
              h={'lg'}
              variant={'outline'}
              onClick={() => handleDateRangeItemClick()}
            >
              {t('update')}
            </Button>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>{t('byDuration')}</Menu.Label>
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
          <Menu.Item icon={<IconSearch size={14} />} sx={{ padding: '3px' }}>
            <Button
              h={'lg'}
              variant={'outline'}
              onClick={() => handleNumberOfDaysClick()}
            >
              {t('update')}
            </Button>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <TimeRange
        startTimestamp={startTimestamp}
        endTimestamp={endTimestamp}
      ></TimeRange>
      {!dateModeChecked && (
        <SegmentedControl
          data={dataSegmentedControl}
          w={500}
          radius={50}
          value={period}
          onChange={setPeriod}
        />
      )}
      {adminData && (
        <Checkbox
          label={'Mode date'}
          checked={dateModeChecked}
          onChange={(event) => setDateModeChecked(event.currentTarget.checked)}
        />
      )}
    </Flex>
  );
  /**
   * fillSegmentedControl
   * @returns
   */
  function fillSegmentedControl(): { label: string; value: string }[] {
    return DAYS_PERIODS.filter(filterMobile(isMobile)).map((d) => {
      const label = formatPeriod(d, t);

      return {
        label: label,
        value: d.toString(),
      };
    });
  }
};

export default ControlPanel;
