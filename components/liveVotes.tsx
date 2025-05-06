import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { Skeleton } from '@heroui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

import { Voted } from './voted';

import { fetcher } from '@/app/lib';
import { useAppStore } from '@/store/store';
import { VoteForFrom } from '@/slices/globals';

export const LiveVotes = ({
  amount,
  bg = true,
  textRight = false,
}: {
  amount: number;
  bg?: boolean;
  textRight?: boolean;
}) => {
  const { selectedRange, wsMsg, setWsMsg } = useAppStore();
  const { data, isLoading } = useSWR(
    `/api/votes?amount=${amount}&rangeStart=${selectedRange.currentPeriod.startDate.getTime()}&rangeEnd=${selectedRange.currentPeriod.endDate.getTime()}`,
    fetcher,
  );

  useEffect(() => {
    setWsMsg([]); // reset realtime on mutate cuz we now got new data
  }, [data]);

  const liveVotes: VoteForFrom[] | undefined = useMemo(() => {
    if (!data) return;
    const wsVotes2Votes = wsMsg.map((e) => {
      return {
        updated: e.updated,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
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
    const realtimeVoteUser = wsMsg.map((e) => e.from.id);
    // because of update votes we should check that no other vote for that user is in data.user.votes
    const filteredVotes = data.votes.filter(
      (e: VoteForFrom) => !realtimeVoteUser.includes(e.from.id),
    );

    return [...wsVotes2Votes, ...filteredVotes]
      .filter((e) => e)
      .sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }) as VoteForFrom[];
  }, [wsMsg, data]);

  if (isLoading) {
    return (
      <div className=" flex flex-col gap-8 justify-evenly pb-7 pt-3 grow h-full px-3">
        {[...Array(3).fill(0)].map((e, i) => (
          <Skeleton key={i} className="w-full h-[20px] rounded-full" />
        ))}
      </div>
    );
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
                animate={{ opacity: 1, y: 0 }}
                className="rounded"
                initial={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Voted key={e.id} bg={bg} textRight={textRight} vote={e} />
              </motion.div>
            );
          })}
      </AnimatePresence>
      {/* {liveVotes &&
        liveVotes.slice(0, amount).map((e) => {
          return <Voted key={e.id} vote={e} bg={bg} textRight={textRight} />;
        })} */}
    </div>
  );
};
