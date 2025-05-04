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
} from 'date-fns';
import { useState } from 'react';
import clsx from 'clsx';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useAppStore } from '@/store/store';
import { tz, TZDate } from '@date-fns/tz';
import { getDateRange } from '@/app/lib';

const START_DATE = new Date(2025, 4, 0);
const TODAY = new TZDate(new Date(), 'America/New_York');

function generateWeeks(start: Date, count: number = 6) {
    return Array.from({ length: count }, (_, i) => addWeeks(start, i));
}

export default function WeeklyCalendarPopover() {
    const { setSelectedWeek, selectedWeek, setSelectedRange } = useAppStore()
    const [currentStart, setCurrentStart] = useState(() =>
        startOfWeek(selectedWeek || TODAY, {
            in: tz('America/New_York'),
            weekStartsOn: 0,
        })
    );
    const onSelect = (weekStart: Date) => {
        setSelectedRange(getDateRange({ offset: weekStart }))
    }

    const weeks = generateWeeks(currentStart, 4);

    const handlePrev = () => {
        const newStart = subWeeks(currentStart, 4);
        if (isBefore(newStart, START_DATE)) return;
        setCurrentStart(newStart);
    };

    const handleNext = () => {
        const nextStart = addWeeks(currentStart, 4);
        if (!isBefore(nextStart, TODAY)) return;
        setCurrentStart(nextStart);
    };

    return (
        <div className="relative inline-block text-left">
            <Popover className="relative">
                <PopoverTrigger className="inline-flex justify-between items-center rounded-md text-sm font-medium focus:outline-none">
                    <Button size='sm'>
                        {selectedWeek
                            ? `${format(selectedWeek, 'MMM d')} – ${format(addDays(selectedWeek, 5), 'MMM d')}`
                            : 'Select a week'}
                        <ChevronDownIcon className="ml-2 h-5 w-5" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent>
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-2">
                            <button
                                onClick={handlePrev}
                                className="p-1 rounded  disabled:opacity-30"
                                disabled={isBefore(currentStart, addWeeks(START_DATE, 1))}
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-semibold">
                                {format(currentStart, 'MMM yyyy')}
                            </span>
                            <button
                                onClick={handleNext}
                                className="p-1 rounded  disabled:opacity-30"
                                disabled={!isBefore(addWeeks(currentStart, 4), TODAY)}
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-xs opacity-70  mb-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day}>{day}</div>
                            ))}
                        </div>
                        <div className="space-y-1 max-h-72 overflow-y-auto">
                            {weeks.map((weekStart) => {
                                const isSelected = selectedWeek && isSameDay(weekStart, selectedWeek);
                                const isFuture = isAfter(weekStart, TODAY);
                                const isNow = isSameDay(weekStart, TODAY)
                                return (
                                    <div
                                        key={weekStart.toString()}
                                        className={clsx(
                                            'grid grid-cols-7 gap-1  rounded-lg m-1 transition-colors duration-300',
                                            isFuture
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer hover:bg-neutral-200 hover:dark:bg-neutral-800',
                                            isSelected && '!outline-primary outline-2 outline !bg-opacity-45',
                                            isNow && 'bg-primary-100'
                                        )}
                                        onClick={() => {
                                            if (!isFuture) {
                                                onSelect(weekStart)
                                                setSelectedWeek(weekStart)
                                            }
                                        }}
                                    >
                                        {[...Array(7)].map((_, i) => {
                                            const day = addDays(weekStart, i);
                                            const today = isSameDay(day, TODAY)
                                            return (
                                                <div key={i} className={clsx(["text-center text-tiny py-1 rounded", today && "bg-secondary-300"])}>
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
