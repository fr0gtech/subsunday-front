'use client';
import { Chip } from '@heroui/chip';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Link } from '@heroui/link';
import { Spinner } from '@heroui/spinner';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  PlayIcon,
} from '@radix-ui/react-icons';
import useSWR from 'swr';
import { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, useDisclosure } from '@heroui/modal';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';

import { Voted } from './voted';
import { Chart } from './chart';
import { Steamicon } from './icons';

import { cleanUrl, fetcher } from '@/app/lib';
import { useAppStore } from '@/store/store';
import { VoteForFrom } from '@/slices/globals';
type SelectedMedia = {
  index: number;
  url: string;
  type: number;
};
export const GameComp = ({
  id,
  steam,
  withImage = false,
  cardBodyClass = '',
}: {
  id: string;
  steam: boolean;
  withImage?: boolean;
  cardBodyClass?: string;
}) => {
  const { currentRange, wsMsg } = useAppStore();
  const { data, isLoading } = useSWR(
    `/api/game?id=${id}&rangeStart=${currentRange.currentPeriod.startDate.getTime()}&rangeEnd=${currentRange.currentPeriod.endDate.getTime()}`,
    fetcher,
  );
  const { data: steamData, isLoading: steamisLoading } = useSWR(
    data && steam && `/api/game/steam?id=${id}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );
  const [loadMoreDetails, setLoadmoreDetails] = useState(false);
  const mediaScroller = useRef<HTMLDivElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia>({
    index: 0,
    url: '',
    type: 0, // 0 = pic, 1 = video
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // we fetch game data from steam?

  useEffect(() => {
    steam &&
      steamData &&
      setSelectedMedia({
        index: 0,
        url: steamData.game.screenshots[0].path_full,
        type: 0,
      });
  }, [steamData]);

  const liveVotes = useMemo(() => {
    if (!data) return;
    const wsVotes2Votes = wsMsg.map((e) => {
      return {
        updated: e.updated,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        for: {
          name: e.for.name,
          id: e.for.id,
        },
        from: {
          name: e.from.name,
          id: e.from.id,
        },
        id: uuidv4(),
      };
    });

    return [...wsVotes2Votes, ...data.game.votes]
      .filter((e) => e)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [wsMsg, data]);

  if (isLoading) {
    return (
      <div className=" h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl w-screen flex justify-center gap-5 flex-col lg:flex-row p-5 lg:p-0">
      <div className="space-y-5 lg:w-1/2 ">
        <Card className={'p-2 gap-3 '}>
          <CardHeader>
            <div className={'items-center gap-5 flex-wrap'}>
              <Link
                color="foreground"
                href={`/game/${steam ? data.game.steamId + '?steam=true' : data.game.id}`}
              >
                <h4 className="text-3xl font-bold">{data.game.name} </h4>
              </Link>
              <div>
                {data.game.dev[0].length > 0 && (
                  <span className="text-tiny">by {data.game.dev}</span>
                )}{' '}
                <span className="ml-2 text-tiny lowercase">
                  {steamData &&
                    steamData.game.recommendations &&
                    `- ${steamData.game.recommendations.total} reviews`}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-5 overflow-hidden ">
            {/* <div className=' bg-red-700 h-[20px]'></div> */}
            <div className="flex gap-5 flex-col lg:flex-row">
              {data.game.picture !== 'default' && data.game.picture.length > 0 && (
                <div className=" relative rounded w-full h-[100px]">
                  <Image
                    fill
                    alt={'item.title'}
                    className=" object-cover rounded-md"
                    loading="lazy"
                    src={cleanUrl(data.game.picture)}
                  />
                </div>
              )}
              <div className="space-y-2">
                {steam && steamisLoading && (
                  <Skeleton>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur pariatur
                    numquam consectetur, inventore id quis ipsam vel facilis perferendis archite
                  </Skeleton>
                )}
                <p className="">{steamData && steamData.game.short_description}</p>
                <div className="flex gap-3 flex-wrap">
                  {data.game.categories &&
                    Object.values(data.game.categories).map((e: any, i) => {
                      if (i > 2) return;

                      return (
                        <Chip key={e.id} size="sm" variant="shadow">
                          {e.description}
                        </Chip>
                      );
                    })}
                  {steam && steamData && steamData.game.price_overview.final && (
                    <Chip color="primary" size="sm" variant="shadow">
                      {steamData.game.price_overview.final / 100}{' '}
                      {steamData.game.price_overview.currency}
                    </Chip>
                  )}
                  <div className="flex gap-2  ">
                    {data.game.website.length > 0 && (
                      <Link
                        className="hover:opacity-100 transition-opacity opacity-50"
                        color="foreground"
                        href={data.game.website}
                        size="sm"
                        target="_blank"
                      >
                        Website
                        <ExternalLinkIcon color="gray" />
                      </Link>
                    )}
                    {data.game.link !== 'notOnSteam' && (
                      <Link
                        className="hover:opacity-100 transition-opacity opacity-50"
                        color="foreground"
                        href={`https://store.steampowered.com/app/${data.game.steamId}`}
                        size="sm"
                        target="_blank"
                      >
                        <Steamicon />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedMedia.url.length > 0 && selectedMedia.type === 0 && (
              <button className="!h-[300px] relative" onClick={() => onOpen()}>
                <Image
                  fill
                  alt="idl"
                  className="object-cover rounded"
                  src={cleanUrl(selectedMedia.url)}
                />
              </button>
            )}
            {steam && (steamisLoading || !steamData) && (
              <Skeleton>
                <button className="!h-[300px] !w-[728px] relative" onClick={() => onOpen()}>
                  <div className="object-cover rounded" />
                </button>
              </Skeleton>
            )}

            {selectedMedia.url.length > 0 && selectedMedia.type === 1 ? (
              <video autoPlay controls src={selectedMedia.url}>
                <track kind="captions" />
              </video>
            ) : (
              <Skeleton className=" rounded-lg" />
            )}
            {steam && (
              <div className="relative rounded-lg overflow-clip bg-content2 p-2">
                <div ref={mediaScroller} className="overflow-scroll relative px-3">
                  <div className=" flex gap-3 w-fit">
                    {steamData &&
                      steamData.game.movies.map(
                        (
                          e: {
                            id: string;
                            thumbnail: string;
                            webm: { max: string };
                            name: string;
                          },
                          i: number,
                        ) => {
                          return (
                            <button
                              key={e.id}
                              className="rounded-xl relative w-[150px] h-[90px] overflow-clip"
                              onClick={() =>
                                setSelectedMedia({ index: i, url: e.webm.max, type: 1 })
                              }
                            >
                              <div className="relative  h-full">
                                <div className="absolute flex-col gap-2 left-0 top-0 w-full z-20 h-full flex items-center justify-center">
                                  <div className="bg-primary p-2 rounded">
                                    <PlayIcon height={15} width={15} />
                                  </div>
                                  <span className="px-3 p-2 rounded bg-content1 text-tiny">
                                    {e.name}
                                  </span>
                                </div>
                                <Image
                                  fill
                                  alt={steamData.game.name}
                                  className=" object-contain"
                                  src={cleanUrl(e.thumbnail)}
                                />
                              </div>
                            </button>
                          );
                        },
                      )}
                    {steamData &&
                      steamData.game.screenshots.map(
                        (e: { id: number; path_thumbnail: string; path_full: string }) => {
                          return (
                            <button
                              key={e.id}
                              className="rounded-xl relative w-[150px] h-[90px] overflow-clip"
                              onClick={() =>
                                setSelectedMedia({
                                  index: e.id,
                                  url: e.path_full,
                                  type: 0,
                                })
                              }
                            >
                              <Image fill alt={steamData.game.name} src={cleanUrl(e.path_full)} />
                            </button>
                          );
                        },
                      )}
                  </div>
                </div>
                <button
                  className="absolute right-0 top-0 bg-content2 h-full shadow z-50"
                  onClick={() => {
                    mediaScroller.current?.scrollBy({ left: 200, behavior: 'smooth' });
                  }}
                >
                  <ChevronRightIcon height={20} width={20} />
                </button>
                <button
                  className="absolute left-0 top-0 bg-content2 h-full shadow z-50"
                  onClick={() => {
                    mediaScroller.current?.scrollBy({ left: -200, behavior: 'smooth' });
                  }}
                >
                  <ChevronLeftIcon height={20} width={20} />
                </button>
              </div>
            )}
          </CardBody>
        </Card>
        {steam && (
          <Card>
            <CardHeader>
              <h4 className="text-xl">Details</h4>
            </CardHeader>
            {!loadMoreDetails ? (
              <>
                <CardBody className="relative overflow-clip">
                  <div className="flex-col gap-3 max-h-[500px] overflow-clip">
                    <div
                      dangerouslySetInnerHTML={
                        steamData && { __html: steamData.game.detailed_description as any }
                      }
                      className=" whitespace-pre-wrap opacity-80 "
                    />
                  </div>
                  <Button
                    className="z-20 -mt-20 w-fit mx-auto"
                    variant="shadow"
                    onPress={() => setLoadmoreDetails(true)}
                  >
                    Load more
                  </Button>
                </CardBody>
                <div className="absolute h-1/2 bottom-0 w-full  bg-gradient-to-t from-background/90 to-transparent" />
              </>
            ) : (
              <CardBody className="relative overflow-clip">
                <div className="flex-col gap-3 overflow-scroll max-h-[90vh]">
                  <div
                    dangerouslySetInnerHTML={
                      steamData && { __html: steamData.game.detailed_description as any }
                    }
                    className=" whitespace-pre-wrap opacity-80 "
                  />
                </div>
                <Button
                  className="z-20 -mt-20 w-fit mx-auto"
                  variant="shadow"
                  onPress={() => setLoadmoreDetails(false)}
                >
                  Hide Details
                </Button>
              </CardBody>
            )}
          </Card>
        )}
      </div>
      <div className={clsx(['lg:w-4/12 space-y-5', !steam && '!'])}>
        <Card className="p-5 ">
          <div className="flex gap-5 mb-5 p-3">
            <div className="text-tiny text-default-500 flex items-center flex-row-reverse gap-2">
              <span>votes this week</span>
              <Chip color="secondary" variant="shadow">
                {data.votesSubSunday._count.votes}
              </Chip>
            </div>
            <div className="text-tiny text-default-500 flex items-center flex-row-reverse gap-2">
              <span>total votes</span>
              <Chip variant="shadow">{data.game._count.votes}</Chip>
            </div>
          </div>
          <Chart id={data.game.id} />
        </Card>
        <Card className={' p-2 '}>
          <CardHeader>
            <h4 className=" text-2xl">Votes</h4>
          </CardHeader>
          <CardBody>
            <div className="gap-2 flex flex-col ">
              {liveVotes &&
                liveVotes.map((e: VoteForFrom, i) => {
                  return <Voted key={i} cardBodyClass={cardBodyClass} vote={e} onGame />;
                })}
            </div>
          </CardBody>
        </Card>
      </div>
      <Modal className="!h-[90vh] !" isOpen={isOpen} size={'' as any} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <ModalBody>
              {selectedMedia.index !== steamData.game.screenshots.length - 1 && (
                <button
                  className="absolute flex justify-center items-center w-[50px] right-0 top-0 bg-neutral-800 h-full shadow"
                  onClick={() => {
                    setSelectedMedia((prev) => {
                      return {
                        index: prev.index + 1,
                        url: steamData.game.screenshots[prev.index].path_full,
                        type: 0,
                      };
                    });
                  }}
                >
                  <ChevronRightIcon height={20} width={20} />
                </button>
              )}

              <Image
                fill
                alt="idl"
                className="object-contain -z-10"
                src={cleanUrl(steamData.game.screenshots[selectedMedia.index].path_full)}
              />
              {selectedMedia.index !== 0 && (
                <button
                  className="absolute flex justify-center items-center w-[50px] left-0 top-0 bg-neutral-800 h-full shadow"
                  onClick={() => {
                    setSelectedMedia((prev) => {
                      return {
                        index: prev.index - 1,
                        url: steamData.game.screenshots[prev.index].path_full,
                        type: 0,
                      };
                    });
                  }}
                >
                  <ChevronLeftIcon height={20} width={20} />
                </button>
              )}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
