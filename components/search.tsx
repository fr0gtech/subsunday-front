import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import { Game, User } from '@/generated/prisma';
import { fetcher } from '@/app/lib';

export const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get('value');

  const { data } = useSWR(search && 'api/search?value=' + search, fetcher);

  return (
    <>
      <h3 className="text-2xl p-2">Search results for &quot;{search}&quot;</h3>
      <div className="flex gap-5 flex-row">
        <div className="w-1/2">
          <h4 className="text-xl p-3">Games</h4>
          {((data && data.games.length === 0) || !data) && (
            <Card>
              <CardBody>No games found</CardBody>
            </Card>
          )}
          <div className="flex gap-2 flex-col">
            {data &&
              data.games.map((e: Game & { _count: { votes: number } }) => {
                return (
                  <Card
                    key={e.id}
                    isPressable
                    className="w-full"
                    onPress={() => {
                      router.push('game/' + e.id);
                    }}
                  >
                    <CardBody className="flex flex-row gap-2 items-center">
                      <Image src={e.picture} width={200} />
                      <div>{e.name}</div>
                      <div className="text-tiny opacity-85">votes: {e._count.votes}</div>
                    </CardBody>
                  </Card>
                );
              })}
          </div>
        </div>

        <div className="w-1/2">
          <h4 className="text-xl p-3">Users</h4>
          {((data && data.users.length === 0) || !data) && (
            <Card>
              <CardBody>No users found</CardBody>
            </Card>
          )}
          <div className="flex gap-2 flex-col">
            {data &&
              data.users.map((e: User & { _count: { votes: number } }) => {
                return (
                  <Card
                    key={e.id}
                    isPressable
                    className="w-full"
                    onPress={() => {
                      router.push('user/' + e.id);
                    }}
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
      </div>
    </>
  );
};
