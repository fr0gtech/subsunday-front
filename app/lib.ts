export const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());
import { io } from 'socket.io-client';

import { setHours, setMinutes, setSeconds, setMilliseconds, nextDay, subDays, Day } from 'date-fns';

type DateRangeOptions = {
  intervalDays: number;
  time: string;
  startDay: Day; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
};

export function getDateRange({ intervalDays, time, startDay }: DateRangeOptions) {
  const [hour, minute] = time.split(':').map(Number);

  const now = new Date();
  const nextStartDay = nextDay(now, startDay);
  const endDate = setMilliseconds(
    setSeconds(setMinutes(setHours(nextStartDay, hour), minute), 0),
    0,
  );
  const startDate = subDays(endDate, intervalDays);

  return { startDate, endDate };
}

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
