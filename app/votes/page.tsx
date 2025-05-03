'use client';
import { Alert, Card, CardBody, CardHeader, Code, Link } from '@heroui/react';
import { LiveVotes } from '@/components/liveVotes';
import { Chart } from '@/components/chart';
import { CurrentVotes } from '@/components/currentVotes';

export default function Home() {
  return (
    <section className=" overflow-hidden p-5 mx-auto gap-2 flex flex-col">
      <div className="flex gap-2 lg:flex-row max-w-screen-xl flex-col justify-center">
        <div className="gap-2 flex flex-col  lg:w-1/2">
          <Card className="h-fit" shadow="md">
            <CardHeader>
              <h4 className=" text-2xl font-bold">Voting</h4>
              <span className="text-tiny"></span>
            </CardHeader>
            <CardBody>
              <p>
                Sub Sunday is a weekly event where subscribers to the channel can vote for games
                they'd like to see Lirik play. Every week, 6 games are selected for the main list
                and 4 as backups from the list of votes.
              </p>
            </CardBody>
            <Alert variant="flat" className="m-5 w-fit mx-auto" color="danger">
              <p>
                The info below is unconfirmed and taken from{' '}
                <Link color="foreground" href="https://lirikker.com/lirik/subday/">
                  here{' '}
                </Link>
              </p>
            </Alert>
          </Card>
          <Card>
            <CardHeader>
              <h5 className="text-xl">About Voting</h5>
            </CardHeader>
            <CardBody>
              <ul className="opacity-80">
                <li>
                  - Every vote is a ticket, and each ticket has the same chance of being picked.
                </li>
                <li>
                  - More tickets with the same game written on them increase the chance of that game
                  being played.
                </li>
                <li>
                  - Every vote counts, so there's still a chance a less popular game could be
                  picked.
                </li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h5 className="text-xl">How to Vote</h5>
            </CardHeader>
            <CardBody>
              <p className="opacity-80">
                Voting can currently only be conducted through Twitch Chat! Any votes through the
                existing website will NOT be included. To vote, simply type <Code>!vote</Code>{' '}
                followed by the name of the game you wish to vote for. Example:{' '}
                <Code>!vote Minecraft</Code>
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h5 className="text-xl">Voting Schedule</h5>
            </CardHeader>
            <CardBody>
              <ul className="opacity-80">
                <li>- When can I vote?</li>
                Monday through Saturday.
              </ul>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col gap-2 lg:w-1/2">
          <Card className="p-5 " shadow="md">
            <CurrentVotes className={'text-xs flex  gap-5 p-0 justify-center'} />
            <Chart />
          </Card>
          <LiveVotes amount={6} />
        </div>
      </div>
    </section>
  );
}
