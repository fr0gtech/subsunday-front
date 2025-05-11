import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { Skeleton } from '@heroui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

import { Voted } from './voted';

import { fetcher } from '@/app/lib';
import { useAppStore } from '@/store/store';
import { VoteForFrom } from '@/slices/globals';
import { VotedMain } from './votedMain';

export const LiveVotesMain = ({
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
      <div className="flex items-center justify-center w-full h-full gap-4">
        {[...Array(amount).fill(0)].map((e, i) => (
          <Skeleton key={i} className="w-full h-[91px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 grid-rows-1 gap-4 h-full items-center">
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
                <VotedMain key={e.id} textRight={textRight} vote={e} />
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
