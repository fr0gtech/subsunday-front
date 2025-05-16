import type { Metadata } from 'next';

import { GameComp } from '@/components/gameComp';
import { prisma } from '@/prisma';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const game = await prisma.game.findFirst({
    where: {
      OR: [
        {
          id: parseInt(slug),
        },
        {
          steamId: parseInt(slug),
        },
      ],
    },
    select: {
      name: true,
      description: true,
    },
  });

  return {
    title: 'Sub Sunday - ' + game?.name,
    description: game?.description,
  };
}

export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <section className="mx-auto mt-20">
      <GameComp id={slug} />
    </section>
  );
}
