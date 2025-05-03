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
} from 'date-fns';
import { tz, TZDate } from '@date-fns/tz';

type DateRangeOptions = {
  fromDay: Day;
  fromTime: string;
  toDay: Day;
  toTime: string; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
};

export function getDateRange({ fromDay, fromTime, toDay, toTime }: DateRangeOptions) {
  const now = new TZDate(new Date(), 'America/New_York');
  const [fromHour, fromMinute] = fromTime.split(':').map(Number);

  const periodStart = previousDay(now, fromDay, { in: tz('America/New_York') });

  const startDate = setMilliseconds(
    setSeconds(setMinutes(setHours  (periodStart, fromHour), fromMinute), 0),
    0,
  );
  const [toHour, toMinute] = toTime.split(':').map(Number);
  const periodEndDate = isSaturday(now) ? now : nextDay(now, toDay, { in: tz('America/New_York') });
  const endDate = setMilliseconds(
    setSeconds(setMinutes(setHours(periodEndDate, toHour), toMinute), 0),
    0,
  );

  console.log(startDate,endDate);
  
  // const nextStartDay = nextDay(now, startDay, { in: tz('America/New_York') });
  // console.log('now', now);
  // console.log('nextStartDay', nextStartDay);
  // console.log('nextDay(now, startDay)', nextDay(now, startDay));
  // console.log(new TZDate(now, 'America/New_York'));

  // const endDate = setMilliseconds(
  //   setSeconds(setMinutes(setHours(nextStartDay, hour), minute), 0),
  //   0,
  // );
  // const startDate = subDays(endDate, intervalDays);

  return { startDate, endDate };
}

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
