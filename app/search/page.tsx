'use client';

import { Card, CardBody, CardHeader, Link } from '@heroui/react';
import { GithubIcon } from '@/components/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '../lib';
import { Game } from '@/generated/prisma';
import { User } from '@prisma/client';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get('value');
  // get query and do stuff

  const { data } = useSWR(search && 'api/search?value=' + search, fetcher);
  return (
    <section className=" overflow-hidden p-5  mx-auto w-full gap-2 flex flex-col max-w-screen-xl">
      <div className="flex gap-5 flex-row">
        <div className='w-1/2'>
          <h4 className='text-xl font-bold p-3'>Games</h4>
          {((data && data.games.length === 0) || !data) && (
            <Card>
              <CardBody>No games found</CardBody>
            </Card>
          )}
          {data &&
            data.games.map((e: Game & { _count: { votes: number } }) => {
              return (
                <Card
                  className='w-full'
                  onPress={(a) => {
                    router.push('game/' + e.id);
                  }}
                  isPressable
                >
                  <CardBody className="flex flex-row gap-2 items-center">
                    <div>{e.name}</div>
                    <div className="text-tiny opacity-85">votes: {e._count.votes}</div>
                  </CardBody>
                </Card>
              );
            })}
        </div>

        <div className='w-1/2 space-y-2'>
          <h4 className='text-xl font-bold p-3'>Users</h4>
          {((data && data.users.length === 0) || !data) && (
            <Card>
              <CardBody>No users found</CardBody>
            </Card>
          )}
          {data &&
            data.users.map((e: User & { _count: { votes: number } }) => {
              return (
                <Card
                  className='w-full'
                  onPress={(a) => {
                    router.push('user/' + e.id);
                  }}
                  isPressable
                >
                  <CardBody className="flex flex-row gap-2 items-center">
                    <div>{e.name}</div>
                    <div className="text-tiny opacity-85">votes: {e._count.votes}</div>
                  </CardBody>
                </Card>
              );
            })}
        </div>
      </div>
    </section>
  );
}
