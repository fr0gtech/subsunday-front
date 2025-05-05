import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { addDays, addMinutes, addSeconds, isAfter, startOfDay, subDays, subWeeks } from 'date-fns';
import { tz, TZDate } from '@date-fns/tz';

export async function GET(req: NextRequest) {
  const take = parseInt(req.nextUrl.searchParams.get('amount') as string);
  const rangeStart = parseInt(req.nextUrl.searchParams.get('rangeStart') as string) || 1;
  const rangeEnd = parseInt(req.nextUrl.searchParams.get('rangeEnd') as string) || 1;

  const votes = await prisma.vote.findMany({
    where: {
      createdAt: {
        gte: new Date(rangeStart),
        lte: new Date(rangeEnd),
      },
    },
    take: take || 6,
    include: {
      for: {
        select: {
          id: true,
          name: true,
        },
      },
      from: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  const taggedVotes = votes.map((e) => {
    const updated = isAfter(e.updatedAt, addSeconds(e.createdAt, 5));
    return {
      ...e,
      updated: updated,
    };
  });

  const today = new TZDate(Date.now(), 'America/New_York');
  const votesLast7Days = await getVotesBetween(subDays(today, 7), 7);
  const voteLastWeek = await getVotesBetween(subDays(today, 14), 7);

  return NextResponse.json({
    votes: taggedVotes,
    graph: votesLast7Days,
    graphPastWeek: voteLastWeek,
  });
}

const getVotesBetween = async (from: Date, daysBack: number) => {
  const recentVotes = await prisma.vote.findMany({
    where: {
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
