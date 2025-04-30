import { GameComp } from '@/components/gameComp';

export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <section className="mx-auto lg:w-1/2">
      <GameComp id={slug} />
    </section>
  );
}
