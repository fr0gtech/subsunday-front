'use client';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Code } from '@heroui/code';
import { Link } from '@heroui/link';
import { Chip } from '@heroui/chip';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { Tooltip } from '@heroui/tooltip';
import { CheckIcon, Cross1Icon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

import { Chart } from '@/components/chart';
import { CurrentVotes } from '@/components/currentVotes';
import WeeklyCalendar from '@/components/weeklyCalendar';
import { SearchVotes } from '@/components/searchVotes';
import { LiveVotes } from '@/components/liveVotes';

export default function Home() {
  const [search, setSearch] = useState('');
  const debounced = useDebounceCallback(setSearch, 500);

  return (
    <section className=" overflow-hidden p-5 mx-auto gap-2 flex flex-col">
      <div className="lg:grid lg:grid-cols-12 lg:grid-rows-6 lg:gap-4 lg:max-w-screen-2xl flex flex-col gap-5">
        <div className="col-span-4 row-span-2">
          <Card className="h-full" shadow="md">
            <CardHeader>
              <h1 className=" text-2xl ">Sub Sunday</h1>
              <span className="text-tiny" />
            </CardHeader>
            <CardBody>
              <p className="opacity-80">
                Sub Sunday is a weekly event where viewer of the channel can vote for games
                they&apos;d like to see <Link href="https://twitch.com/lirik">Lirik</Link> play.
                <br />
                <br />
                <b> This does not mean that the most voted game will be played.</b>
                <br />
                <br /> This website is a non official vote tracker and is not able to provide
                accurate data.
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="col-span-3 row-span-3 col-start-5 row-start-3">
          <Card>
            <CardHeader>
              <h2 className="text-xl">Voting Schedule</h2>
            </CardHeader>
            <CardBody>
              <p className="flex gap-2 !te">
                <Code className="!text-tiny">Sunday 00:00</Code> -{' '}
                <Code className="!text-tiny">Saturday 22:00</Code>
                <Code className="!text-tiny">GMT-4</Code>
              </p>
              <div className="">
                <div className="px-5 py-5 max-w-[300px] mx-auto">
                  <WeeklyCalendar useless />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-2 col-span-4  row-span-4 col-start-1 row-start-3">
          <Card className="p-3 space-y-2">
            <p>Search for your username to see votes we track</p>
            <div className="flex gap-2 item-center">
              <Input label="Search" size="sm" type="text" onValueChange={debounced} />
            </div>
          </Card>
          {search.length > 0 ? <SearchVotes amount={6} query={search} /> : <LiveVotes amount={6} />}
        </div>
        <div className="col-span-5 row-span-3 col-start-8 row-start-3">
          <Card className="p-5 h-full" shadow="md">
            <CurrentVotes className={'text-xs flex mb-10  gap-5 p-0 justify-center'} />
            <div className="p-5 h-full">
              <Chart />
            </div>
          </Card>
        </div>
        <div className="col-span-8 row-span-2 col-start-5 row-start-1">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl">How to Vote</h2>
            </CardHeader>
            <CardBody>
              <p>
                Voting can be done in two different ways and you don&apos;t need to be a subscriber.{' '}
                <b>You can use ur channel points to vote!</b>
              </p>
              <div className="overflow-scroll">
                <Table removeWrapper className="py-3 min-w-[500px]">
                  <TableHeader>
                    <TableColumn>Method</TableColumn>
                    <TableColumn>How</TableColumn>
                    <TableColumn>For</TableColumn>
                    <TableColumn className="flex gap-1 items-center">
                      Tracked{' '}
                      <Tooltip content="If we can track that vote on here">
                        <InfoCircledIcon />
                      </Tooltip>
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell className=" whitespace-nowrap">Twitch Chat</TableCell>
                      <TableCell>
                        simply type{' '}
                        <Code className="!text-sm" size="sm">
                          !vote
                        </Code>{' '}
                        followed by the name of the game you wish to vote for.
                      </TableCell>
                      <TableCell className="flex gap-2 flex-wrap">
                        <Chip size="sm">Subscriber</Chip>
                        <Chip size="sm">Everyone</Chip>
                      </TableCell>
                      <TableCell>
                        <Chip className="mx-auto" color="success" size="sm">
                          <CheckIcon />
                        </Chip>
                      </TableCell>
                    </TableRow>
                    <TableRow key="2">
                      <TableCell>sub.vote</TableCell>
                      <TableCell>
                        Visit{' '}
                        <Link href="https://sub.vote" size="sm">
                          sub.vote
                        </Link>{' '}
                        login and vote.
                      </TableCell>
                      <TableCell className="flex gap-2 flex-wrap">
                        <Chip size="sm">Subscriber</Chip>
                        <Chip isDisabled size="sm">
                          Everyone
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color="danger" size="sm">
                          <Cross1Icon />
                        </Chip>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
