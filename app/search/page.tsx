'use client';

import { Search } from '@/components/search';
import { Suspense } from 'react';

export default function Home() {

  return (
    <section className=" overflow-hidden p-5  mx-auto w-full gap-2 flex flex-col max-w-screen-xl">
      <Suspense>
        <Search />
      </Suspense>
    </section>
  );
}
