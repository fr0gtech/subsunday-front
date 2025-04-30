'use client';

import { Chip, Spinner, Tooltip } from '@heroui/react';
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

  return (
    <div className={className}>
      {data ? (
        <div className='flex items-center gap-4'>
          <span className="opacity-60 font-bold lowercase">Votes this week: </span>
          <Tooltip content={`total votes: ${data && data.total + msgEvents.length}`}>
            <motion.div
              className=''
              key={data.now + msgEvents.length}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Chip size="sm" color="primary" variant="dot">
                {data.now + msgEvents.length}
              </Chip>
            </motion.div>
          </Tooltip>
        </div>
      ) : (
        <Spinner size="sm" color="white" />
      )}
    </div>
  );
};
