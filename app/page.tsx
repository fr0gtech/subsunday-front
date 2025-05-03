'use client';
import { CurrentVotes } from '@/components/currentVotes';
import { MainItem } from '@/components/mainItem';
import { VotingPeriod } from '@/components/votingPeriod';
import { Image } from '@heroui/react';

export default function Home() {

  return (
    <section className="relative flex h-full flex-col items-start justify-start gap-4 w-full">
      {/* <CurrentVotes className="flex lg:hidden mx-auto p-2 gap-3 text-tiny" /> */}

      <MainItem />
    </section>
  );
}
