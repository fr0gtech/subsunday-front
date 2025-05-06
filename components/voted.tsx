import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { VoteForFrom } from '@/slices/globals';

export const Voted = ({
  vote,
  bg = true,
  textRight = false,
  onGame = false,
  cardBodyClass = '',
}: {
  vote: VoteForFrom;
  bg?: boolean;
  textRight?: boolean;
  onGame?: boolean;
  cardBodyClass?: string;
}) => {
  const [time, setTime] = useState<Date>(new Date());

  // make relative dates update, this is probably not the best way to do this but should be fine if we only display a few items
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Card
      shadow={bg ? 'none' : 'md'}
      style={{ background: bg ? '' : 'none', boxShadow: bg ? '' : 'none' }}
    >
      <CardBody className={cardBodyClass}>
        {onGame ? (
          <span className="text-tiny leading-8" style={{ textAlign: textRight ? 'right' : 'left' }}>
            <Link href={`/user/${vote.from.id}`}>
              <Chip className="whitespace-pre-wrap" color="primary" size="sm" variant="flat">
                {vote.from.name}
              </Chip>
            </Link>{' '}
            <span>voted</span>{' '}
            <span className="text-tiny opacity-80">
              {time && formatDistance(new Date(vote.updatedAt), new Date(), { addSuffix: true })}{' '}
            </span>
          </span>
        ) : (
          <span className="text-tiny leading-8" style={{ textAlign: textRight ? 'right' : 'left' }}>
            <span className="text-tiny opacity-80">
              {time && formatDistance(new Date(vote.updatedAt), new Date(), { addSuffix: true })}{' '}
            </span>
            <Link href={`/user/${vote.from.id}`}>
              <Chip className="whitespace-pre-wrap" color="primary" size="sm" variant="flat">
                {vote.from.name}
              </Chip>
            </Link>{' '}
            {vote.updated ? <span>update vote to</span> : <span>voted for</span>}{' '}
            <Link href={`/game/${vote.for.id}`}>
              <Chip className=" whitespace-pre-wrap" color="secondary" size="sm" variant="flat">
                {vote.for.name}
              </Chip>
            </Link>
          </span>
        )}
      </CardBody>
    </Card>
  );
};
