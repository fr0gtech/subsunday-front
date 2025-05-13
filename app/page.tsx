import { MainItem } from '@/components/mainItem';

export default function Home() {
  return (
    <section className=" gap-4 w-full pt-16 ">
      {/* <CurrentVotes className="flex lg:hidden mx-auto p-2 gap-3 text-tiny" /> */}
      <MainItem />
    </section>
  );
}
