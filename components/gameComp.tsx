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
import { Image } from '@heroui/image';
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
export const GameComp = ({ id, cardBodyClass = '' }: { id: string; cardBodyClass?: string }) => {
  const { currentRange, wsMsg } = useAppStore();
  const { data, isLoading } = useSWR(
    `/api/game?id=${id}&rangeStart=${currentRange.currentPeriod.startDate.getTime()}&rangeEnd=${currentRange.currentPeriod.endDate.getTime()}`,
    fetcher,
  );
  // const { data: steamData, isLoading: steamisLoading } = useSWR(
  //   data && steam && `/api/game/steam?id=${id}`,
  //   fetcher,
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: false,
  //   },
  // );
  const isSteam = data && data.game.steamId > 0;
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
    data &&
      data.game.screenshots[0] &&
      setSelectedMedia({
        index: 0,
        url: data.game.screenshots[0].path_full,
        type: 0,
      });
  }, [data]);

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
              <Link color="foreground" href={`/game/${data.game.steamId || data.game.id}`}>
                <h4 className="text-3xl font-bold">{data.game.name} </h4>
              </Link>
              <div>
                {data.game.dev[0].length > 0 && (
                  <span className="text-tiny">by {data.game.dev}</span>
                )}{' '}
                <span className="ml-2 text-tiny lowercase">
                  {data &&
                    data.game.recommendations > 0 &&
                    `- ${data.game.recommendations} reviews`}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-5 overflow-hidden ">
            {/* <div className=' bg-red-700 h-[20px]'></div> */}
            <div className="flex gap-5 flex-col lg:flex-row mb-10">
              {data.game.picture !== 'default' && data.game.picture.length > 0 && (
                <div className=" relative rounded mt-5 w-full p-5 pt-0">
                  <Image
                    isBlurred
                    alt={'item.title'}
                    className=" object-cover rounded-md"
                    loading="lazy"
                    src={cleanUrl(data.game.picture)}
                  />
                </div>
              )}
              <div className="space-y-2">
                {isLoading && (
                  <Skeleton>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur pariatur
                    numquam consectetur, inventore id quis ipsam vel facilis perferendis archite
                  </Skeleton>
                )}
                <p className="lg:mt-5">{data && data.game.description}</p>
                <div className="flex gap-3 flex-wrap">
                  {data.game.categories &&
                    Object.values(data.game.categories).map((e: any, i) => {
                      if (i > 2) return;

                      return (
                        <Chip key={e.id} size="sm" color='secondary' variant="shadow">
                          {e.description}
                        </Chip>
                      );
                    })}
                  {data && data.game.price.final && (
                    <Chip color="primary" size="sm" variant="shadow">
                      {data.game.price.final / 100}
                      {data.game.price.currency}
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
              <button className="mx-auto relative " onClick={() => onOpen()}>
                <Image
                  alt="idl"
                  className=" rounded object-contain h-full"
                  src={cleanUrl(selectedMedia.url)}
                />
              </button>
            )}
            {isLoading && (
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
            {isSteam &&
              <div className="relative rounded-lg overflow-clip bg-content2 p-2">
                <div ref={mediaScroller} className="overflow-scroll relative px-3">
                  <div className=" flex gap-3 w-fit">
                    {isSteam && Object.keys(data.game.movies).length > 0 &&
                      data.game.movies.map(
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
                                  isBlurred
                                  alt={data.game.name}
                                  className=" object-contain"
                                  src={cleanUrl(e.thumbnail)}
                                />
                              </div>
                            </button>
                          );
                        },
                      )}
                    {data &&
                      Object.keys(data.game.screenshots).length > 0 &&
                      data.game.screenshots.map(
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
                              <Image isBlurred alt={data.game.name} src={cleanUrl(e.path_full)} />
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
            }
          </CardBody>
        </Card>
        {isSteam &&
          <Card>
            <CardHeader>
              <h4 className="text-xl">Details</h4>
            </CardHeader>
            {!loadMoreDetails && isSteam && (
              <>
                <CardBody className="relative overflow-clip">
                  <div className="flex-col gap-3 max-h-[500px] overflow-clip">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: JSON.parse(data.game.detailedDescription).html,
                      }}
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
            )}
            {loadMoreDetails && isSteam && (
              <CardBody className="relative overflow-clip">
                <div className="flex-col gap-3 overflow-scroll max-h-[90vh]">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: JSON.parse(data.game.detailedDescription).html,
                    }}
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
        }
      </div>
      <div className={clsx(['lg:w-4/12 space-y-5'])}>
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
              <Chip color="primary" variant="shadow">
                {data.game._count.votes}
              </Chip>
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
              {selectedMedia.index !== data.game.screenshots.length - 1 && (
                <button
                  className="absolute flex justify-center items-center w-[50px] right-0 top-0 bg-neutral-800 h-full shadow"
                  onClick={() => {
                    setSelectedMedia((prev) => {
                      return {
                        index: prev.index + 1,
                        url: data.screenshots[prev.index].path_full,
                        type: 0,
                      };
                    });
                  }}
                >
                  <ChevronRightIcon height={20} width={20} />
                </button>
              )}

              <Image
                isBlurred
                alt="idl"
                className="object-contain -z-10"
                src={cleanUrl(data.game.screenshots[selectedMedia.index].path_full)}
              />
              {selectedMedia.index !== 0 && (
                <button
                  className="absolute flex justify-center items-center w-[50px] left-0 top-0 bg-neutral-800 h-full shadow"
                  onClick={() => {
                    setSelectedMedia((prev) => {
                      return {
                        index: prev.index - 1,
                        url: data.game.screenshots[prev.index].path_full,
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
    </div >
  );
};
