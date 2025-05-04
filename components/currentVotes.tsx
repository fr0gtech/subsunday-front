'use client';

import { Chip, Skeleton, Spinner, Tooltip } from '@heroui/react';
import useSWR from 'swr';
import { fetcher, socket } from '@/app/lib';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NumberFlow from '@number-flow/react';
import { useAppStore } from '@/store/store';

export const CurrentVotes = ({ className }: { className: string }) => {
  const { selectedRange } = useAppStore()
  const { data, isLoading } = useSWR(`/api/voteoverview?rangeStart=${selectedRange.currentPeriod.startDate.getTime()}&rangeEnd=${selectedRange.currentPeriod.endDate.getTime()}`, fetcher);
  const [msgEvents, setMsgEvents] = useState<any>([]);

  useEffect(() => {
    const onMsgEvent = (value: any) => {
      setMsgEvents((previous: any) => [...previous, value]);
    };

    socket.emit('join', 'main');
    socket.on('vote', onMsgEvent);

    return () => {
      socket.emit('leave', 'main');
      socket.off('vote', onMsgEvent);
    };
  }, []);

  useEffect(() => {
    setMsgEvents([]);
  }, [data]);

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
            <Tooltip content={`total votes: ${data && data.total + msgEvents.length}`}>
              <Chip
                size="lg"
                color="secondary"
                variant="shadow"
                className="cursor-default boldChip"
              >
                <NumberFlow
                  isolate
                  className="left-0 bottom-0"
                  value={data.now + msgEvents.length}
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
                value={data.today + msgEvents.length}
              />
            </Chip>
          </div>
        </div>
      )}
    </div>
  );
};
