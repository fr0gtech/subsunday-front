'use client';

import { Chip } from '@heroui/chip';
import { Skeleton } from '@heroui/skeleton';
import { Tooltip } from '@heroui/tooltip';
import useSWR from 'swr';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';

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
        <div className="flex justify-end gap-2 flex-row items-center">
          <span className="lowercase opacity-60">Votes this week</span>
          <Skeleton className="rounded-full">
            <Chip className="cursor-default boldChip" color="secondary" size="sm" variant="light">
              ds
            </Chip>
          </Skeleton>
        </div>
        <div className="flex justify-end gap-2 flex-row items-center">
          <span className="lowercase  opacity-60">Votes today</span>
          <Skeleton className="rounded-full">
            <Chip className=" cursor-default boldChip" color="success" size="sm" variant="shadow">
              cs
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
          <NumberFlowGroup>
            <div className="flex justify-end gap-2 flex-row items-center">
              <span className="lowercase whitespace-nowrap">Votes this week</span>
              <Tooltip content={`total votes: ${data && data.total + wsMsg.length}`}>
                <Chip
                  radius="sm"
                  className="cursor-default boldChip"
                  color="secondary"
                  size="sm"
                  variant="flat"
                >
                  <NumberFlow isolate className="left-0 bottom-0" value={data.now + wsMsg.length} />
                </Chip>
              </Tooltip>
            </div>
            <div className="flex justify-end gap-2 flex-row items-center">
              <span className="lowercase whitespace-nowrap">Votes today</span>
              <Chip
                radius="sm"
                className=" cursor-default boldChip"
                color="success"
                size="sm"
                variant="flat"
              >
                <NumberFlow isolate className="left-0 bottom-0" value={data.today + wsMsg.length} />
              </Chip>
            </div>
          </NumberFlowGroup>
        </div>
      )}
    </div>
  );
};
