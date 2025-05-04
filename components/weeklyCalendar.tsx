// components/WeeklyCalendarPopover.tsx
'use client';

import {
    format,
    startOfWeek,
    addWeeks,
    isBefore,
    isSameDay,
    addDays,
    subWeeks,
    isAfter,
    max as dateMax,
} from 'date-fns';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@heroui/react';
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@radix-ui/react-icons';
import { useAppStore } from '@/store/store';
import { tz, TZDate } from '@date-fns/tz';
import { getDateRange } from '@/app/lib';

const START_DATE = new Date(2025, 3, 28);
const TODAY = new TZDate(new Date(), 'America/New_York');
const WEEK_PAGE_SIZE = 4;

const MIN_START = startOfWeek(START_DATE, {
    in: tz('America/New_York'),
    weekStartsOn: 0,
});

function generateWeeks(start: Date, count: number = WEEK_PAGE_SIZE) {
    return Array.from({ length: count }, (_, i) => addWeeks(start, i));
}

export default function WeeklyCalendarPopover() {
    const { setSelectedWeek, selectedWeek, setSelectedRange } = useAppStore();

    const [currentStart, setCurrentStart] = useState<Date>(() => {
        const initial = startOfWeek(
            selectedWeek || TODAY,
            { in: tz('America/New_York'), weekStartsOn: 0 }
        );
        return dateMax([initial, MIN_START]);
    });

    useEffect(() => {
        if (selectedWeek) {
            const week = startOfWeek(selectedWeek, {
                in: tz('America/New_York'),
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
        const newStart = dateMax([
            subWeeks(currentStart, WEEK_PAGE_SIZE),
            MIN_START,
        ]);
        setCurrentStart(newStart);
    };
    const handleNext = () => {
        const candidate = addWeeks(currentStart, WEEK_PAGE_SIZE);
        const maxStart = startOfWeek(TODAY, {
            in: tz('America/New_York'),
            weekStartsOn: 0,
        });
        setCurrentStart(dateMax([candidate, MIN_START]) <= maxStart ? candidate : maxStart);
    };

    const prevDisabled = isSameDay(currentStart, MIN_START);
    const nextDisabled = isSameDay(
        currentStart,
        startOfWeek(TODAY, {
            in: tz('America/New_York'),
            weekStartsOn: 0,
        })
    );

    const middleWeek = weeks[Math.floor(weeks.length / 2)];

    return (
        <div className="relative">
            <Popover className="relative">
                <PopoverTrigger className="inline-flex items-center">
                    <Button size="sm">
                        {selectedWeek
                            ? `${format(selectedWeek, 'MMM d')} – ${format(
                                addDays(selectedWeek, 6),
                                'MMM d'
                            )}`
                            : 'Select a week'}
                        <ChevronDownIcon className="ml-2 h-5 w-5" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent>
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-2">
                            <button
                                onClick={handlePrev}
                                className="p-1 rounded disabled:opacity-30"
                                disabled={prevDisabled}
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-semibold">
                                {format(middleWeek, 'MMM yyyy')}
                            </span>
                            <button
                                onClick={handleNext}
                                className="p-1 rounded disabled:opacity-30"
                                disabled={nextDisabled}
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-xs opacity-70 mb-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                <div key={d}>{d}</div>
                            ))}
                        </div>

                        <div className="space-y-1 max-h-72 overflow-y-auto">
                            {weeks.map((weekStart) => {
                                const isSel = selectedWeek && isSameDay(weekStart, selectedWeek);
                                const isFuture = isAfter(weekStart, TODAY);
                                const isNow = isSameDay(weekStart, TODAY);
                                return (
                                    <div
                                        key={weekStart.toString()}
                                        className={clsx(
                                            'grid grid-cols-7 gap-1 my-2 rounded-lg m-1 transition-colors',
                                            isFuture
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer hover:bg-neutral-200 hover:dark:bg-neutral-800',
                                            isSel && '!outline-primary-300 outline-2 outline ',
                                            isNow && 'bg-primary-100'
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
                                                        'text-center text-tiny py-1 rounded',
                                                        today && 'bg-secondary-300'
                                                    )}
                                                >
                                                    {format(day, 'd')}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
