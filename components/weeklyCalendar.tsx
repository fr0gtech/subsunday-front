// components/WeeklyCalendarPopover.tsx
'use client';

import {
  format,
  startOfWeek,
  addWeeks,
  isSameDay,
  addDays,
  subWeeks,
  isAfter,
  max as dateMax,
} from 'date-fns';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { tz, TZDate } from '@date-fns/tz';

import { useAppStore } from '@/store/store';
import { getDateRange } from '@/app/lib';

const START_DATE = new Date(2025, 3, 28);
const TODAY = new TZDate(new Date(), process.env.NEXT_PUBLIC_TZ as string);
const WEEK_PAGE_SIZE = 4;

const MIN_START = startOfWeek(START_DATE, {
  in: tz(process.env.NEXT_PUBLIC_TZ as string),
  weekStartsOn: 0,
});

function generateWeeks(start: Date, count: number = WEEK_PAGE_SIZE) {
  return Array.from({ length: count }, (_, i) => addWeeks(start, i));
}

export default function WeeklyCalendar() {
  const { setSelectedWeek, selectedWeek, setSelectedRange } = useAppStore();

  const [currentStart, setCurrentStart] = useState<Date>(() => {
    const initial = startOfWeek(selectedWeek || TODAY, {
      in: tz(process.env.NEXT_PUBLIC_TZ as string),
      weekStartsOn: 0,
    });

    return dateMax([initial, MIN_START]);
  });

  useEffect(() => {
    if (selectedWeek) {
      const week = startOfWeek(selectedWeek, {
        in: tz(process.env.NEXT_PUBLIC_TZ as string),
        weekStartsOn: 0,
      });

      setCurrentStart(dateMax([week, MIN_START]));
    }
  }, [selectedWeek]);

  const onSelect = (weekStart: Date) => {
    setSelectedRange(getDateRange({ offset: weekStart }));
    setSelectedWeek(weekStart);
  };

  const weeks = generateWeeks(currentStart, WEEK_PAGE_SIZE);

  const handlePrev = () => {
    const newStart = dateMax([subWeeks(currentStart, WEEK_PAGE_SIZE), MIN_START]);

    setCurrentStart(newStart);
  };
  const handleNext = () => {
    const candidate = addWeeks(currentStart, WEEK_PAGE_SIZE);
    const maxStart = startOfWeek(TODAY, {
      in: tz(process.env.NEXT_PUBLIC_TZ as string),
      weekStartsOn: 0,
    });

    setCurrentStart(dateMax([candidate, MIN_START]) <= maxStart ? candidate : maxStart);
  };

  const prevDisabled = isSameDay(currentStart, MIN_START);
  const nextDisabled = isSameDay(
    currentStart,
    startOfWeek(TODAY, {
      in: tz(process.env.NEXT_PUBLIC_TZ as string),
      weekStartsOn: 0,
    }),
  );

  const middleWeek = weeks[Math.floor(weeks.length / 2)];

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-2">
        <button
          className="p-1 rounded disabled:opacity-30"
          disabled={prevDisabled}
          onClick={handlePrev}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">{format(middleWeek, 'MMM yyyy')}</span>
        <button
          className="p-1 rounded disabled:opacity-30"
          disabled={nextDisabled}
          onClick={handleNext}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs opacity-70 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className=" max-h-72 flex flex-col gap-2">
        {weeks.map((weekStart) => {
          const isSel = selectedWeek && isSameDay(weekStart, selectedWeek);
          const isFuture = isAfter(weekStart, TODAY);
          const isNow = isSameDay(weekStart, TODAY);

          return (
            <button
              key={weekStart.toString()}
              className={clsx(
                'grid grid-cols-7 gap-2 p-1 rounded transition-colors w-full ',
                isFuture
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:bg-neutral-200 hover:dark:bg-neutral-800',
                isSel && '!outline-primary-300 outline-2 outline ',
                isNow && 'bg-primary-100',
              )}
              onClick={() => {
                if (!isFuture) onSelect(weekStart);
              }}
            >
              {[...Array(7)].map((_, i) => {
                const day = addDays(weekStart, i);
                const today = isSameDay(day, TODAY);

                return (
                  <div
                    key={i}
                    className={clsx(
                      'text-center text-tiny py-1 rounded ',
                      today && 'bg-secondary-300',
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                );
              })}
            </button>
          );
        })}
      </div>
    </div>
  );
}
