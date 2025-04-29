'use client';

import { Chip, Spinner, Tooltip } from '@heroui/react';
import useSWR from 'swr';
import { fetcher } from '@/app/lib';

export const CurrentVotes = ({ className }: { className: string }) => {
  const { data, isLoading } = useSWR(`/api/navbar`, fetcher);
  return (
    <div className={className}>
      {data ? (
        <div>
          <span className="opacity-60 font-bold lowercase">Votes this week: </span>

          <Tooltip content={`total votes: ${data && data.total}`}>
            <Chip size="sm" color="primary" variant="flat">
              {data && data.now}
            </Chip>
          </Tooltip>
        </div>
      ) : (
        <Spinner size="sm" color="white" />
      )}
    </div>
  );
};
