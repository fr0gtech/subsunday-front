import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { startOfDay, subDays, subWeeks } from 'date-fns';

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

  const today = new Date();
  const startDate = startOfDay(subDays(today, 6)); // 6 days ago, start of day

  // Get all votes from the last 7 days
  const recentVotes = await prisma.vote.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const voteCounts = Array(7).fill(0);
  for (const vote of recentVotes) {
    const dayDiff = Math.floor(
      (startOfDay(vote.createdAt).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (dayDiff >= 0 && dayDiff < 7) {
      voteCounts[dayDiff]++;
    }
  }

  const todayAweekAgo = subWeeks(new Date(), 1);
  const startDateAWeekAgo = startOfDay(subDays(todayAweekAgo, 6)); // 6 days ago, start of day

  // Get all votes from the last 7 days
  const recentVotesAweekAgo = await prisma.vote.findMany({
    where: {
      createdAt: {
        gte: startDateAWeekAgo,
        lte: todayAweekAgo,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const voteCountsAWeekAgo = Array(7).fill(0);
  for (const vote of recentVotes) {
    const dayDiff = Math.floor(
      (startOfDay(vote.createdAt).getTime() - startDateAWeekAgo.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (dayDiff >= 0 && dayDiff < 7) {
      voteCounts[dayDiff]++;
    }
  }

  return NextResponse.json({
    votes: votes,
    graph: voteCounts,
    graphPastWeek: voteCountsAWeekAgo,
  });
}
