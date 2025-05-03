'use client';

import { Chip, Skeleton, Spinner, Tooltip } from '@heroui/react';
import useSWR from 'swr';
import { fetcher, socket } from '@/app/lib';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CurrentVotes = ({ className }: { className: string }) => {
  const { data, isLoading } = useSWR(`/api/navbar`, fetcher);
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
    setMsgEvents([])
  }, [data])

  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className='w-[100px] h-[20px] rounded-lg' />
        <Skeleton className='w-[30px] h-[20px] rounded-lg' />
        <Skeleton className='w-[100px] h-[20px] rounded-lg' />
        <Skeleton className='w-[30px] h-[20px] rounded-lg' />
      </div>
    )
  }

  return (
    <div>
      {data &&
        <div className={className}>
          <div className='flex justify-end gap-5 flex-row-reverse items-center'>
            <span className="lowercase">Votes this week </span>
            <Tooltip content={`total votes: ${data && data.total + msgEvents.length}`}>
              <motion.div
                className=''
                key={data.now + msgEvents.length}
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 1, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <Chip size="sm" color="secondary" variant="shadow" className='cursor-default boldChip'>
                  {data.now + msgEvents.length}
                </Chip>
              </motion.div>
            </Tooltip>
          </div>
          <div className='flex justify-end gap-2 flex-row-reverse items-center'>
            <span className="lowercase">Votes today</span>
            <motion.div
              className=''
              key={data.today + msgEvents.length}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Chip size="sm" color="success" variant="shadow" className=' cursor-default boldChip'>
                {data.today + msgEvents.length}
              </Chip>
            </motion.div>

          </div>
        </div>
      }
    </div>
  );
};
