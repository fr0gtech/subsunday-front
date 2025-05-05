'use client';

import { Chip, Skeleton, Tooltip } from '@heroui/react';
import useSWR from 'swr';
import NumberFlow from '@number-flow/react';

import { fetcher } from '@/app/lib';
import { useAppStore } from '@/store/store';

export const CurrentVotes = ({ className }: { className: string }) => {
  const { selectedRange, wsMsg } = useAppStore();
  const { data, isLoading } = useSWR(
    `/api/voteoverview?rangeStart=${selectedRange.currentPeriod.startDate.getTime()}&rangeEnd=${selectedRange.currentPeriod.endDate.getTime()}`,
    fetcher,
  );

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex justify-end gap-2 flex-col-reverse items-center">
          <span className="lowercase opacity-60">Votes this week</span>
          <Skeleton className="rounded-full">
            <Chip className="cursor-default boldChip" color="secondary" size="lg" variant="shadow">
              dsfdd
            </Chip>
          </Skeleton>
        </div>
        <div className="flex justify-end gap-2 flex-col-reverse items-center">
          <span className="lowercase  opacity-60">Votes today</span>
          <Skeleton className="rounded-full">
            <Chip className=" cursor-default boldChip" color="success" size="lg" variant="shadow">
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
                className="cursor-default boldChip"
                color="secondary"
                size="lg"
                variant="shadow"
              >
                <NumberFlow isolate className="left-0 bottom-0" value={data.now + wsMsg.length} />
              </Chip>
            </Tooltip>
          </div>
          <div className="flex justify-end gap-2 flex-col-reverse items-center">
            <span className="lowercase  opacity-60">Votes today*</span>
            <Chip className=" cursor-default boldChip" color="success" size="lg" variant="shadow">
              <NumberFlow isolate className="left-0 bottom-0" value={data.today + wsMsg.length} />
            </Chip>
          </div>
        </div>
      )}
    </div>
  );
};
