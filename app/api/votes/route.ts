import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { addDays, startOfDay, subDays, subWeeks } from 'date-fns';

export async function GET() {
  const votes = await prisma.vote.findMany({
    take: 10,
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
      createdAt: 'desc',
    },
  });

  const today = Date.now()
  const votesLast7Days = await getVotesBetween(subDays(today, 7), 7)
  const voteLastWeek = await getVotesBetween(subDays(today, 14), 7)

  return NextResponse.json({
    votes: votes,
    graph: votesLast7Days,
    graphPastWeek: voteLastWeek,
  });
}


const getVotesBetween = async(from: Date, daysBack: number) =>
{

  const recentVotes = await prisma.vote.findMany({
    where: {
      createdAt: {
        gte: from,
        lte: addDays(from, daysBack)
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
  return votes
}