import { prisma } from '@/prisma';
import { getDateRange } from './lib';

export default async function sitemap() {
  const range = getDateRange();
  const voteCounts = await prisma.vote.groupBy({
    by: ['gameName'],
    where: {
      createdAt: {
        gte: range.currentPeriod.startDate,
        lte: range.currentPeriod.endDate,
      },
    },
    orderBy: [
      {
        _count: {
          gameName: 'desc',
        },
      },
      { gameName: 'desc' },
    ],
    take: 50,
  });
  const gameIds = voteCounts.map((v) => v.gameName);

  const games = await prisma.game.findMany({
    where: {
      name: { in: gameIds },
    },
    select: {
      id: true,
      updatedAt: true,
      name: true,
    },
  });

  return games.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/game/${product.id}`,
    lastModified: product.updatedAt,
  }));
}
