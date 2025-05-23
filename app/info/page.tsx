import { Alert } from '@heroui/alert';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Link } from '@heroui/link';
import { Metadata } from 'next';

import { GithubIcon } from '@/components/icons';
export const metadata: Metadata = {
  title: 'Sub Sunday - Info, Supported Games, Github links',
  description: 'This project was made for fun and does not represet what happens to your vote.',
};
export default function Home() {
  return (
    <section className=" overflow-hidden p-5  mx-auto w-full gap-2 flex flex-col max-w-screen-xl mt-16">
      <div className="flex gap-5 w-full flex-col lg:flex-row">
        <div className="gap-5 flex flex-col ">
          <Alert hideIcon className="w-full mx-auto" color="danger">
            <p className="">
              This website was made for fun. This is <b>not</b> an Official sub sunday website
            </p>
          </Alert>
          <Card className="h-fit" shadow="md">
            <CardHeader>
              <h1 className=" text-2xl font-bold">About</h1>
              <span className="text-tiny" />
            </CardHeader>

            <CardBody>
              <p>
                This project was made for fun and does not represet what happens to your vote.
                <br />
                <br />
                <b>Votes may be inaccurate</b>
                <br />
                <br />
                open a github issue if you got any questions or want to contribute/share ideas.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl">Supported Games</h2>
            </CardHeader>
            <CardBody>
              <p className="opacity-80">
                Only steam games have images, price and so on but we also track non steam games just
                without any metadata. We may look at another source of info in the future to support
                more games.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl">Credit</h2>
            </CardHeader>
            <CardBody>
              <p className="opacity-80">Here some sources used to create this website:</p>
              <p className="mt-2">Sources:</p>
              <ul className="opacity-80">
                <li>
                  <Link href="https://ragnapixel.itch.io/particle-fx">ragnapixel</Link>: images
                </li>
                <li>
                  <Link href="https://steam.com">Steam</Link>: images, Prices, Descriptions
                </li>
                <li>
                  <Link href="https://lirikker.com/lirik/subday">lirikker.com</Link>: Info about Sub
                  Sunday
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
        <div className="flex gap-5 flex-col lg:w-5/6">
          <Card>
            <CardHeader>
              <Link color="foreground" href="https://github.com/fr0gtech/subsunday-front">
                <h2 className="text-xl">Frontend</h2>
                <GithubIcon className="ml-2" />
              </Link>
            </CardHeader>
            <CardBody>
              <p className="opacity-80">The code for the website you are on right now.</p>
              <p className="mt-2">Using:</p>
              <ul className="opacity-80">
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
              <Link color="foreground" href="https://github.com/fr0gtech/subsunday-back">
                <h2 className="text-xl">Backend</h2>
                <GithubIcon className="ml-2" />
              </Link>
            </CardHeader>
            <CardBody>
              <p className="opacity-80">The code for the backend that tracks votes.</p>
              <p className="mt-2">Using:</p>
              <ul className="opacity-80">
                <li>Bun.js</li>
                <li>Prisma</li>
                <li>Socket.io</li>
                <li>tmi.js</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
