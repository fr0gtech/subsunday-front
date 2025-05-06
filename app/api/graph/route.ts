import { NextRequest, NextResponse } from 'next/server';
import { addDays, startOfDay, subDays } from 'date-fns';
import { TZDate } from '@date-fns/tz';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const game = parseInt(req.nextUrl.searchParams.get('game') as string);

  const today = new TZDate(Date.now(), process.env.NEXT_PUBLIC_TZ as string);
  const votesLast7Days = await getVotesBetween(subDays(today, 7), 7, game);
  const voteLastWeek = await getVotesBetween(subDays(today, 14), 7, game);

  return NextResponse.json({
    graph: votesLast7Days,
    graphPastWeek: voteLastWeek,
  });
}
const getVotesBetween = async (from: Date, daysBack: number, game: number) => {
  const filter4game = game > 0 ? { for: { id: game } } : {};
  const recentVotes = await prisma.vote.findMany({
    where: {
      ...filter4game,
      createdAt: {
        gte: from,
        lte: addDays(from, daysBack),
      },
    },
    select: {
      createdAt: true,
    },
  });

  const votes = Array(7).fill(0);

  for (const vote of recentVotes) {
    const dayDiff = Math.floor(
      (startOfDay(vote.createdAt).getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (dayDiff >= 0 && dayDiff < daysBack) {
      votes[dayDiff]++;
    }
  }

  return votes;
};
