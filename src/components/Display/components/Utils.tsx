import {
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarTime,
  IconClock,
} from '@tabler/icons-react';
import { PredefinedPeriods } from './Types';
export const FIRST_OF_MAY = 1682892000000;
export const START_DATE = 1687212000000;

export function getCalendarIcon(
  period: PredefinedPeriods,
  size: number | string,
  stroke: number | string | undefined = undefined,
): React.ReactNode {
  let Icon = <IconCalendar size={size}></IconCalendar>;
  switch (period) {
    case PredefinedPeriods.Last24Hours:
      Icon = <IconClock size={size} stroke={stroke}></IconClock>;
      break;
    case PredefinedPeriods.Last7Days:
      Icon = <IconCalendarTime size={size} stroke={stroke}></IconCalendarTime>;
      break;
    case PredefinedPeriods.Last30Days:
      Icon = <IconCalendarTime size={size} stroke={stroke}></IconCalendarTime>;
      break;
    case PredefinedPeriods.CurrentMonth:
      Icon = <IconCalendarDue size={size} stroke={stroke}></IconCalendarDue>;
      break;
    case PredefinedPeriods.LastMonth:
      Icon = (
        <IconCalendarEvent size={size} stroke={stroke}></IconCalendarEvent>
      );
      break;
    case PredefinedPeriods.Last3Months:
      Icon = <IconCalendarPlus size={size} stroke={stroke}></IconCalendarPlus>;
      break;
    case PredefinedPeriods.FromStart:
      Icon = <IconCalendar size={size} stroke={stroke}></IconCalendar>;
      break;
    // Add cases for other predefined periods as needed
    default:
      // Handle default case
      break;
  }

  return Icon;
}
