'use client';
import useSWR from 'swr';
import { Vote } from '@/generated/prisma';
import { fetcher } from '../lib';
import { Voted } from '@/components/voted';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

import { Alert, Card, CardBody, CardHeader, Code, Link } from '@heroui/react';
import { GithubIcon } from '@/components/icons';

export default function Home() {
  const { data } = useSWR(`/api/votes`, fetcher);
  const [msgEvents, setMsgEvents] = useState<any>([]);

  return (
    <section className=" overflow-hidden px-10 mx-auto w-full gap-2 flex flex-col max-w-6xl">
      <div className='flex gap-2 w-full flex-col lg:flex-row'>
        <div className='gap-2 flex flex-col '>
          <Card className='h-fit' shadow='md'>
            <CardHeader>
              <h4 className=' text-2xl font-bold'>Info</h4><p className="text-tiny ml-5">This website was made for fun. And is not official</p>
              <span className='text-tiny'></span>
            </CardHeader>
            <CardBody>
              <p>
                Votes may not be accurate because its hard to find
                any confirmed information about sub sunday.
                <br />
                If you can confirm any information or want to contribute in any other way let us know by opening a github issue.
              </p>
            </CardBody>

          </Card>

          <Card>
            <CardHeader>
              <h5 className='text-xl'>Supported Games</h5><GithubIcon className='ml-2' />
            </CardHeader>
            <CardBody>
              <p className='opacity-80'>
                Only steam games have images, price and so on but we also track non steam games just without any
                metadata. We may look at another source of info in the future to support more games.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h5 className='text-xl'>Credit</h5>
            </CardHeader>
            <CardBody>
              <p className='opacity-80'>
                Here some sources used to create this website:
              </p>
              <p className='mt-2'>
                Sources:
              </p>
              <ul className='opacity-80'>
                <li><Link href='https://steam.com'>Steam</Link>: images, Prices, Descriptions</li>
                <li><Link href='https://lirikker.com/lirik/subday'>lirikker.com</Link>: Info about Sub Sunday</li>
              </ul>
            </CardBody>
          </Card>
        </div>
        <div className='flex gap-2 flex-col lg:w-5/6'>
          <Card>
            <CardHeader>
              <Link href='https://github.com/fr0gtech/subsunday-front' color='foreground'>
                <h5 className='text-xl'>Frontend</h5><GithubIcon className='ml-2' />
              </Link>
            </CardHeader>
            <CardBody>
              <p className='opacity-80'>
                The code for the website you are on right now.
              </p>
              <p className='mt-2'>
                Using:
              </p>
              <ul className='opacity-80'>
                <li>react</li>
                <li>next.js</li>
                <li>heroUi</li>
                <li>tailwindcss</li>
                <li>Socket.io</li>
                <li>Prisma</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Link href='https://github.com/fr0gtech/subsunday-back' color='foreground'>
                <h5 className='text-xl'>Backend</h5><GithubIcon className='ml-2' />
              </Link>
            </CardHeader>
            <CardBody>
              <p className='opacity-80'>
                The code for the backend that tracks votes.
              </p>
              <p className='mt-2'>
                Using:
              </p>
              <ul className='opacity-80'>
                <li>Bun.js</li>
                <li>Prisma</li>
                <li>Socket.io</li>
                <li>tmi.js</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </section >
  );
}
