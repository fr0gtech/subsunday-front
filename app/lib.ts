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
  getDay,
} from 'date-fns';
import { tz, TZDate } from '@date-fns/tz';

type DateRangeOptions = {
  _fromDay?: Day;
  _fromTime?: string;
  _toDay?: Day;
  _toTime?: string; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  offset?: Date;
};

export function getDateRange(options?: DateRangeOptions) {
  const { _fromDay, _fromTime, _toDay, _toTime, offset } = options || {};

  const fromDay = (_fromDay || process.env.NEXT_PUBLIC_FROM_DAY) as Day;
  const fromTime = (_fromTime || process.env.NEXT_PUBLIC_FROM_TIME) as string;
  const toDay = (_toDay || process.env.NEXT_PUBLIC_TO_DAY) as Day;
  const toTime = (_toTime || process.env.NEXT_PUBLIC_TO_TIME) as string;

  const now = new TZDate(offset || new Date(), process.env.NEXT_PUBLIC_TZ as string);
  const [fromHour, fromMinute] = fromTime.split(':').map(Number);

  const periodStart =
    getDay(now) == fromDay
      ? now
      : previousDay(now, fromDay, { in: tz(process.env.NEXT_PUBLIC_TZ as string) });

  const startDate = setMilliseconds(
    setSeconds(setMinutes(setHours(periodStart, fromHour), fromMinute), 0),
    0,
  );

  const [toHour, toMinute] = toTime.split(':').map(Number);

  // relative from start we get the next day
  const periodEndDate = nextDay(periodStart, toDay, {
    in: tz(process.env.NEXT_PUBLIC_TZ as string),
  });
  const endDate = setMilliseconds(
    setSeconds(setMinutes(setHours(periodEndDate, toHour), toMinute), 0),
    0,
  );

  const nextStart = nextDay(periodEndDate, fromDay, {
    in: tz(process.env.NEXT_PUBLIC_TZ as string),
  });

  const nextStartDate = setMilliseconds(
    setSeconds(setMinutes(setHours(nextStart, fromHour), fromMinute), 0),
    0,
  );

  // if its sunday we want to use the last Period to fetch items and display data?
  return {
    currentPeriod: {
      startDate,
      endDate,
      nextStartDate,
    },
    isSunday: getDay(now) == 0,
    lastPeriod: {
      startDate: subDays(startDate, 7),
      endDate: subDays(endDate, 7),
      nextStartDate: subDays(nextStartDate, 7),
    },
  };
}

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
