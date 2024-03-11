import {
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarTime,
  IconClock,
  TablerIcon,
} from '@tabler/icons';
import { PredefinedPeriods } from './Types';
export const FIRST_OF_MAY = 1682892000000;
export const START_DATE = 1687212000000;

export function getCalendarIcon(period: PredefinedPeriods): TablerIcon {
  let Icon = IconCalendar;
  switch (period) {
    case PredefinedPeriods.Last24Hours:
      Icon = IconClock;
      break;
    case PredefinedPeriods.Last7Days:
      Icon = IconCalendarTime;
      break;
    case PredefinedPeriods.Last30Days:
      Icon = IconCalendarTime;
      break;
    case PredefinedPeriods.CurrentMonth:
      Icon = IconCalendarDue;
      break;
    case PredefinedPeriods.LastMonth:
      Icon = IconCalendarEvent;
      break;
    case PredefinedPeriods.Last3Months:
      Icon = IconCalendarPlus;
      break;
    case PredefinedPeriods.FromStart:
      Icon = IconCalendar;
      break;
    // Add cases for other predefined periods as needed
    default:
      // Handle default case
      break;
  }

  return Icon;
}
