'use client';

import { Chip, Skeleton, Spinner, Tooltip } from '@heroui/react';
import useSWR from 'swr';
import { fetcher } from '@/app/lib';
import NumberFlow from '@number-flow/react';
import { useAppStore } from '@/store/store';

export const CurrentVotes = ({ className }: { className: string }) => {
  const { selectedRange, wsMsg } = useAppStore()
  const { data, isLoading } = useSWR(`/api/voteoverview?rangeStart=${selectedRange.currentPeriod.startDate.getTime()}&rangeEnd=${selectedRange.currentPeriod.endDate.getTime()}`, fetcher);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex justify-end gap-2 flex-col-reverse items-center">
          <span className="lowercase opacity-60">Votes this week</span>
          <Skeleton className='rounded-full'>

            <Chip
              size="lg"
              color="secondary"
              variant="shadow"
              className="cursor-default boldChip"
            >
              dsfdd
            </Chip>
          </Skeleton>
        </div>
        <div className="flex justify-end gap-2 flex-col-reverse items-center">
          <span className="lowercase  opacity-60">Votes today</span>
          <Skeleton className='rounded-full'>
            <Chip size="lg" color="success" variant="shadow" className=" cursor-default boldChip">
              cscdd
            </Chip>
          </Skeleton>
        </div>
      </div>
    );
  }

  return (
    <div>
      {data && (
        <div className={className}>
          <div className="flex justify-end gap-2 flex-col-reverse items-center">
            <span className="lowercase opacity-60">Votes this week*</span>
            <Tooltip content={`total votes: ${data && data.total + wsMsg.length}`}>
              <Chip
                size="lg"
                color="secondary"
                variant="shadow"
                className="cursor-default boldChip"
              >
                <NumberFlow
                  isolate
                  className="left-0 bottom-0"
                  value={data.now + wsMsg.length}
                />
              </Chip>
            </Tooltip>
          </div>
          <div className="flex justify-end gap-2 flex-col-reverse items-center">
            <span className="lowercase  opacity-60">Votes today*</span>
            <Chip size="lg" color="success" variant="shadow" className=" cursor-default boldChip">
              <NumberFlow
                isolate
                className="left-0 bottom-0"
                value={data.today + wsMsg.length}
              />
            </Chip>
          </div>
        </div>
      )}
    </div>
  );
};
