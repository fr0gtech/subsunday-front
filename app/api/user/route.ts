import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('id') as string;

  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(userId),
    },
    select: {
      name: true,
      votes: {
        select: {
          createdAt: true,
          for: true,
          from: true,
        },
      },
    },
  });

  return NextResponse.json({
    user: user,
  });
}
