import type { Metadata } from 'next';

import { UserComp } from '@/components/userComp';
import { prisma } from '@/prisma';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const game = await prisma.user.findFirst({
    where: {
      id: parseInt(slug),
    },
  });

  return {
    title: 'Sub Sunday - ' + game?.name,
  };
}
export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <section className="flex w-full h-full flex-col items-start justify-start gap-4">
      <UserComp id={slug} />
    </section>
  );
}
