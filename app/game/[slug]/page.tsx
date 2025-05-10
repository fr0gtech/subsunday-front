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
          steamId: parseInt(slug)
        }
      ]
    },
    select: {
      name: true,
      description: true
    }
  });

  return {
    title: 'Sub Sunday - ' + game?.name,
    description: game?.description,
  };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { steam } = await searchParams;

  return (
    <section className="mx-auto">
      <GameComp steam={steam === 'true' ? true : false} withImage id={slug} />
    </section>
  );
}
