import { fetcher, socket } from '@/app/lib';
import { Vote } from '@/generated/prisma';
import { useEffect, useMemo, useState } from 'react';
import { Voted } from './voted';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { TZDate } from '@date-fns/tz';
import { Skeleton } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/store';
import { wsVote } from '@/app/providers';

export type VoteForFrom = Vote & { from: { name: string; id: number } } & {
  for: { name: string; id: number };
};
export const LiveVotes = ({
  amount,
  bg = true,
  textRight = false,
}: {
  amount: number;
  bg?: boolean;
  textRight?: boolean;
}) => {
  const { selectedRange, wsMsg, setWsMsg } = useAppStore()
  const { data, isLoading } = useSWR(`/api/votes?amount=${amount}&rangeStart=${selectedRange.currentPeriod.startDate.getTime()}&rangeEnd=${selectedRange.currentPeriod.endDate.getTime()}`, fetcher);

  useEffect(() => {
    setWsMsg([]) // reset realtime on mutate cuz we now got new data 
  }, [data])

  const liveVotes: (VoteForFrom | wsVote)[] | undefined = useMemo(() => {
    if (!data) return;
    const wsVotes2Votes = wsMsg.map((e) => {
      return {
        createdAt: e.createdAt,
        for: {
          name: e.for.name,
          id: e.for.id,
        },
        from: {
          name: e.from.name,
          id: e.from.id,
        },
        id: e.id,
      };
    });
    return [...wsVotes2Votes, ...(data.votes as VoteForFrom[])]
      .filter((e) => e)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }) as (VoteForFrom | wsVote)[];
  }, [wsMsg, data]);

  if (isLoading) {
    return (<div className=' flex flex-col gap-8 justify-evenly pb-7 pt-3 grow h-full px-3'>
      {[...Array(3).fill(0)].map((e, i) => <Skeleton key={i} className='w-full h-[20px] rounded-full' />)}
    </div>)
  }

  return (
    <div className="space-y-2 grow ">
      <AnimatePresence initial={false}>
        {liveVotes &&
          liveVotes.slice(0, amount).map((e) => {
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="rounded"
              >
                <Voted key={e.id} vote={e} bg={bg} textRight={textRight} />
              </motion.div>
            )
          })}
      </AnimatePresence>
      {/* {liveVotes &&
        liveVotes.slice(0, amount).map((e) => {
          return <Voted key={e.id} vote={e} bg={bg} textRight={textRight} />;
        })} */}
    </div>
  );
};
