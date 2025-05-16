// components/WeeklyCalendarPopover.tsx
'use client';

import { format, addDays } from 'date-fns';
import { Button } from '@heroui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import WeeklyCalendar from './weeklyCalendar';

import { useAppStore } from '@/store/store';

export default function WeeklyCalendarPopover() {
  const { selectedWeek } = useAppStore();

  return (
    <div className="relative">
      <Popover className="relative">
        <PopoverTrigger>
          <div className='text-xs flex gap-2 bg-content1 p-1 h-[32px] rounded-lg items-center justify-center px-3'>
            {selectedWeek
              ? `${format(selectedWeek, 'MMM d')} – ${format(addDays(selectedWeek, 6), 'MMM d')}`
              : 'Select a week'}
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <WeeklyCalendar />
        </PopoverContent>
      </Popover>
    </div>
  );
}
