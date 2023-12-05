import React, { useState, useEffect } from 'react';
import { SegmentedControl, Checkbox, Group } from '@mantine/core';
import { DAYS_PERIODS, filterMobile } from '../../../constants';
import { formatPeriod } from 'src/utils/format/format';
import { useTranslation } from 'react-i18next';
import {
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarTime,
  IconClock,
} from '@tabler/icons';
import { PredefinedPeriods } from './Types';
import {
  getTimestampFirstDayOfCurrentMonth,
  getTimestampStartOfNDaysAgo,
  getTimestampFirstDayOfNMonthsAgo,
  calculateDaysBetweenDateAndToday,
  calculateDaysBetweenDates,
  getTimestampLastDayOfNMonthAgo,
  getTimestampEndOfTheDay,
  START_DATE,
} from './Utils';

import { TimeSelectDrawer } from './TimeSelectDrawer';
import { TimeSelectMenu } from './TimeSelectMenu';

import { TimeRange } from './TimeRange';
import { useDisclosure } from '@mantine/hooks';
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
  //const [menuOpened, setMenuOpened] = useState(false);
  const [menuLabel, setMenuLabel] = useState<string>(t(defaultValue));
  const [numberInput, setNumberInput] = useState<number | ''>(1);
  const [startDateInput, setStartDateInput] = useState<Date | null>(null);
  const [endDateInput, setEndDateInput] = useState<Date | null>(null);
  const [startDateError, setStartDateError] = useState(false);
  const [IconMenu, setIconMenu] = useState<React.ReactNode>(
    <IconCalendar size={20}></IconCalendar>,
  );
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [menuOpened, { open: openMenu, close: closeMenu }] =
    useDisclosure(false);

  const dataSegmentedControl: { label: string; value: string }[] =
    fillSegmentedControl();

  const handlePredefinedPeriodClick = (value: PredefinedPeriods) => {
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
      case PredefinedPeriods.FromStart:
        // Handle Last 3 Months
        const startDate = START_DATE;
        const duration = calculateDaysBetweenDates(today, startDate);
        setStartTimestamp(startDate);
        setEndTimestamp(today);
        setPeriod(duration.toString());
        setIconMenu(<IconCalendar size={20}></IconCalendar>);
        break;
      // Add cases for other predefined periods as needed
      default:
        // Handle default case
        break;
    }
    closeMenu();
    setMenuLabel(t(value));
    closeDrawer();
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
      closeMenu();
      setStartTimestamp(startDate);
      setEndTimestamp(endDate);
      setPeriod(duration.toString());
      setIconMenu(<IconCalendar size={20}></IconCalendar>);
    }
    closeDrawer();
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
    closeMenu();
    setIconMenu(<IconCalendarTime size={20}></IconCalendarTime>);
    closeDrawer();
  };

  useEffect(() => {
    handlePredefinedPeriodClick(defaultValue);
  }, []);

  return (
    <Group
      mih={isMobile ? 50 : 70}
      spacing={'xs'}
      position={'left'}
      align={'center'}
      m={isMobile ? 10 : undefined}
    >
      {dateModeChecked && (
        <>
          {isMobile && (
            <TimeSelectDrawer
              IconMenu={IconMenu}
              closeDrawer={closeDrawer}
              openDrawer={openDrawer}
              drawerOpened={drawerOpened}
              menuLabel={menuLabel}
              numberInput={numberInput}
              setNumberInput={setNumberInput}
              startDateInput={startDateInput}
              startDateError={startDateError}
              setStartDateInput={setStartDateInput}
              setStartDateError={setStartDateError}
              endDateInput={endDateInput}
              setEndDateInput={setEndDateInput}
              handleDateRangeItemClick={handleDateRangeItemClick}
              handleNumberOfDaysClick={handleNumberOfDaysClick}
              handlePredefinedPeriodClick={handlePredefinedPeriodClick}
            ></TimeSelectDrawer>
          )}
          {!isMobile && (
            <TimeSelectMenu
              IconMenu={IconMenu}
              closeMenu={closeMenu}
              openMenu={openMenu}
              menuOpened={menuOpened}
              menuLabel={menuLabel}
              numberInput={numberInput}
              setNumberInput={setNumberInput}
              startDateInput={startDateInput}
              startDateError={startDateError}
              setStartDateInput={setStartDateInput}
              setStartDateError={setStartDateError}
              endDateInput={endDateInput}
              setEndDateInput={setEndDateInput}
              handleDateRangeItemClick={handleDateRangeItemClick}
              handleNumberOfDaysClick={handleNumberOfDaysClick}
              handlePredefinedPeriodClick={handlePredefinedPeriodClick}
            ></TimeSelectMenu>
          )}
          <TimeRange
            startTimestamp={startTimestamp}
            endTimestamp={endTimestamp}
          ></TimeRange>
        </>
      )}
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
    </Group>
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
