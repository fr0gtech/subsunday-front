export const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());
import { io } from 'socket.io-client';

import {
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  nextDay,
  subDays,
  Day,
  previousDay,
  isSaturday,
  isToday,
  getDay,
} from 'date-fns';
import { tz, TZDate } from '@date-fns/tz';

type DateRangeOptions = {
  _fromDay?: Day;
  _fromTime?: string;
  _toDay?: Day;
  _toTime?: string; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
};

export function getDateRange(options?: DateRangeOptions) {
  const { _fromDay, _fromTime, _toDay, _toTime } = options || {};
  // if we dont get any paras check env
  const fromDay = (_fromDay || process.env.NEXT_PUBLIC_FROM_DAY) as Day;
  const fromTime = (_fromTime || process.env.NEXT_PUBLIC_FROM_TIME) as string;
  const toDay = (_toDay || process.env.NEXT_PUBLIC_TO_DAY) as Day;
  const toTime = (_toTime || process.env.NEXT_PUBLIC_TO_TIME) as string;
  // after a period is over this should return new period so we can do "vote open"
  // with this we can also check if date is beofe start we are in closed voting period
  const now = new TZDate(new Date(), 'America/New_York');
  const [fromHour, fromMinute] = fromTime.split(':').map(Number);

  const periodStart =
    getDay(now) === fromDay ? now : previousDay(now, fromDay, { in: tz('America/New_York') });

  const startDate = setMilliseconds(
    setSeconds(setMinutes(setHours(periodStart, fromHour), fromMinute), 0),
    0,
  );
  const [toHour, toMinute] = toTime.split(':').map(Number);
  // so if we are at sunday when closed the period end is not going to be nextDay but lastDay
  const periodEndDate = isSaturday(now) ? now : nextDay(now, toDay, { in: tz('America/New_York') });
  const endDate = setMilliseconds(
    setSeconds(setMinutes(setHours(periodEndDate, toHour), toMinute), 0),
    0,
  );
  return { startDate, endDate };
}

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
