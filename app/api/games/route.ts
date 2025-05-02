import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {

  // we need to cursor this req and depending on screen size we
  // load more games on useIntersec? (visible) if needed this is the best way to create the exact amount of items we need?
  // but how would mutate work? we don't need cuz of socket?
  // calcing by screensize sounds dumb
  // easiest way to do it would be to provide index but still mutate?
  //
  // or we just load a shitton and don't give a fuck? <-
  const games = await prisma.game.findMany({
    where: {
      name: {
        not: '',
      },
    },
    orderBy: {
      votes: {
        _count: 'desc',
      },
    },
    include: {
      _count: {
        select: { votes: true },
      },
    },
    take: 50,
  });

  return NextResponse.json({
    games: games,
  });
}
