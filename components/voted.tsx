import { Vote } from '@/generated/prisma';
import { Card, CardBody, Chip } from '@heroui/react';
import { formatDistance } from 'date-fns';
import Link from 'next/link';

export const Voted = ({
  vote,
}: {
  vote: Vote & { from: { name: string; id: number } } & { for: { id: number; name: string } };
}) => {
  return (
    <Card>
      <CardBody className="">
        <span className="text-tiny !text-left leading-8">
          {formatDistance(new Date(vote.createdAt), new Date(), { addSuffix: true })}{' '}
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
