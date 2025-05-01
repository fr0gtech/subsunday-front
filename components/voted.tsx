import { Vote } from '@/generated/prisma';
import { Card, CardBody, Chip } from '@heroui/react';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const Voted = ({
  vote,
}: {
  vote: Vote & { from: { name: string; id: number } } & { for: { id: number; name: string } };
}) => {
  const [time, setTime] = useState<Date>(new Date())
  // make relative dates update, this is probably not the best way to do this but should be fine if we only display a few items
  useEffect(() =>{
    const interval = setInterval(()=>{
      setTime(new Date())
    }, 5000)

    return () =>{
      clearInterval(interval)
    }
  },[])
  return (
    <Card shadow='md'>
      <CardBody className="">
        <span className="text-tiny !text-left leading-8">
          {time && formatDistance(new Date(vote.createdAt), new Date(), { addSuffix: true })}{' '}
          <Link href={`/user/${vote.from.id}`}>
            <Chip size="sm" color="primary" variant="flat" className="whitespace-pre-wrap">
              {vote.from.name}
            </Chip>
          </Link>{' '}
          <span>voted for</span>{' '}
          <Link href={`/game/${vote.for.id}`}>
            <Chip size="sm" color="secondary" variant="flat" className=" whitespace-pre-wrap">
              {vote.for.name}
            </Chip>
          </Link>
        </span>
      </CardBody>
    </Card>
  );
};
