import useSWR from 'swr';
import { Skeleton } from '@heroui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

import { Voted } from './voted';

import { fetcher } from '@/app/lib';
import { VoteForFrom } from '@/slices/globals';

export const SearchVotes = ({
  amount,
  query,
  bg = true,
  textRight = false,
}: {
  amount: number;
  query: string;
  bg?: boolean;
  textRight?: boolean;
}) => {
  const { data, isLoading } = useSWR(`/api/votes?query=${query}&take=${amount}`, fetcher);

  if (isLoading) {
    return (
      <div className=" flex flex-col gap-2 grow h-full">
        {[...Array(amount).fill(0)].map((e, i) => (
          <Skeleton key={i} className="w-full h-[56px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 grow whitespace-nowrap overflow-scroll">
      <AnimatePresence initial={false}>
        {data &&
          data.votes.slice(0, amount).map((e: VoteForFrom) => {
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
