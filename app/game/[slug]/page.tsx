import type { Metadata } from 'next';

import { GameComp } from '@/components/gameComp';
import { prisma } from '@/prisma';
import Head from 'next/head';

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
      steamId: true,
      id: true,
      name: true,
      description: true,
    },
  });
  const canonicalUrl = `https://sub-sunday.com/game/${game?.steamId || game?.id}`

  return {
    title: 'Sub Sunday - ' + game?.name,
    description: game?.description,
    alternates:{
      canonical: canonicalUrl,
    }
  };
}

export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <section className="mx-auto mt-20">
      <Head>
        <link rel="canonical" href={`https://sub-sunday.com/game/${slug}`}/>

      </Head>
      <GameComp id={slug} />
    </section>
  );
}
