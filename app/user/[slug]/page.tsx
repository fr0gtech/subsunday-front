import { UserComp } from '@/components/userComp';

export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <section className="flex h-full flex-col items-start justify-start gap-4">
      <UserComp id={slug} />
    </section>
  );
}
