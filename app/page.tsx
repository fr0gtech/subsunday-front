'use client';
import { CurrentVotes } from '@/components/currentVotes';
import { MainItem } from '@/components/mainItem';

export default function Home() {

  return (
    <section className="flex h-full flex-col items-start justify-start gap-4">
      <CurrentVotes className="flex lg:hidden mx-auto p-2 gap-3 text-tiny" />
      <MainItem />
    </section>
  );
}
