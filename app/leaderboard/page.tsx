'use client';
import useSWR from 'swr';
import { Chip } from '@heroui/chip';
import { Link } from '@heroui/link';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';

import { fetcher } from '../lib';

import { Game, User } from '@/generated/prisma';

export default function Home() {
  const { data } = useSWR(`/api/top`, fetcher);

  return (
    <section className=" flex-wrap flex h-full lg:justify-center justify-start items-start w-full max-w-screen-xl mx-auto gap-4 ">
      <div className="grow p-3">
        <h5 className="text-xl p-3">Top Users by streak</h5>
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
                      <Link className=" cursor-pointer" color="foreground" href={`/user/${e.id}`}>
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
      <div className="grow p-3">
        <h5 className="text-xl p-3">Top Users by votes</h5>
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
                      <Link className=" cursor-pointer" color="foreground" href={`/user/${e.id}`}>
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
      <div className="grow p-3">
        <h5 className="text-xl p-3">Top Games by votes</h5>
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
                      <Link className=" cursor-pointer" color="foreground" href={`/game/${e.id}`}>
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
