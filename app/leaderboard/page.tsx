'use client';
import useSWR from 'swr';
import {
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { Game, User } from '@/generated/prisma';
import { fetcher } from '../lib';

export default function Home() {
  const { data } = useSWR(`/api/top`, fetcher);

  return (
    <section className=" flex-wrap flex h-full lg:justify-center justify-start items-start w-full gap-4 p-5">
      <div className="grow">
        <h4 className="py-3 px-2 text-large lowercase">Top user by streak</h4>
        <Table aria-label="top user by streak">
          <TableHeader>
            <TableColumn>RANK</TableColumn>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>STREAK</TableColumn>
          </TableHeader>
          <TableBody>
            {data &&
              data.topStreak.map((e: User & { _count: { votes: number } }, i: number) => {
                return (
                  <TableRow key={i}>
                    <TableCell className="relative">
                      <Chip className="z-10 font-bold"># {i + 1}</Chip>
                    </TableCell>
                    <TableCell className="relative">
                      <Link href={`/user/${e.id}`} color="foreground" className=" cursor-pointer">
                        {e.name}
                      </Link>
                    </TableCell>
                    <TableCell>{e.streak}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <div className="grow">
        <h4 className="py-3 px-2 text-large lowercase">Top user by vote</h4>
        <Table aria-label="top user by vote">
          <TableHeader>
            <TableColumn>RANK</TableColumn>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>VOTES</TableColumn>
            <TableColumn>isSub</TableColumn>
          </TableHeader>
          <TableBody>
            {data &&
              data.topUsers.map((e: User & { _count: { votes: number } }, i: number) => {
                return (
                  <TableRow key={i}>
                    <TableCell className="relative">
                      <Chip className="z-10 font-bold"># {i + 1}</Chip>
                    </TableCell>
                    <TableCell className="relative">
                      <Link href={`/user/${e.id}`} color="foreground" className=" cursor-pointer">
                        {e.name.substring(0, 25)}
                      </Link>
                    </TableCell>
                    <TableCell>{e._count.votes}</TableCell>
                    <TableCell>{e.sub ? 'true' : 'false'}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <div className="grow">
        <h4 className="py-3 px-2 text-large lowercase">Top Games by vote</h4>
        <Table aria-label="top games by vote">
          <TableHeader>
            <TableColumn>RANK</TableColumn>
            <TableColumn>GAME</TableColumn>
            <TableColumn>VOTES</TableColumn>
          </TableHeader>
          <TableBody>
            {data &&
              data.topGames.map((e: Game & { _count: { votes: number } }, i: number) => {
                return (
                  <TableRow key={i}>
                    <TableCell className="relative">
                      <Chip className="z-10 font-bold"># {i + 1}</Chip>
                    </TableCell>
                    <TableCell>
                      <Link href={`/game/${e.id}`} color="foreground" className=" cursor-pointer">
                        {e.name.substring(0, 25)}
                      </Link>
                    </TableCell>
                    <TableCell>{e._count.votes}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
