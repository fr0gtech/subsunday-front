import { Game } from "@/generated/prisma";
import { addToast, Card, Chip, Image, Skeleton, Tooltip } from "@heroui/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo, Steamicon } from "./icons";
import { socket, fetcher } from "@/app/lib";
import { useState, useEffect, useMemo, useCallback } from "react";
import useSWR from "swr";
import { wsMsg } from "@/types";

export const MainItem = () => {
    const [msgEvents, setMsgEvents] = useState<wsMsg[]>([]);
    const router = useRouter();

    useEffect(() => {
        const onMsgEvent = (value: wsMsg) => {
            setMsgEvents((previous: wsMsg[]) => [...previous, value]);
            toast(value)
        };

        socket.emit('join', 'main');
        socket.on('vote', onMsgEvent);

        return () => {
            socket.emit('leave', 'main');
            socket.off('vote', onMsgEvent);
        };
    }, []);

    const toast = useCallback((value: { for: { name: any; }; from: { name: any; }; }) => {
        addToast({
            color: "primary",
            title: `New Vote for ${value.for.name} from ${value.from.name}`,
        });
    }, [msgEvents])

    const { data, isLoading } = useSWR(`/api/games`, fetcher);

    const updateableGames = useMemo(() => {
        if (!data) return;
        const wsVotes = msgEvents.reduce((acc: { [x: string]: any }, curr: { for: any }) => {
            const game = curr.for;
            acc[game] = (acc[game] || 0) + 1;
            return acc;
        }, {});
        return data.games
            .map((e: Game & { _count: { votes: number } }) => {
                return {
                    ...e,
                    _count: {
                        votes: e._count.votes + (wsVotes[e.name] || 0),
                    },
                };
            })
            .sort((a: any, b: any) => (a._count.votes > b._count.votes ? -1 : 1));
    }, [msgEvents, data]);

    if (isLoading) {
        return (
            <section className="flex h-full flex-col items-start justify-start gap-4">
                <div className="p-3 lg:p-5 flex flex-wrap gap-7">
                    {[...Array(25).fill(0).map((e, i) => {
                        return <Card key={i} className="overflow-visible max-w-[400px] min-w-[352px] grow min-h-[188px] cursor-pointer">

                            <div className="relative flex flex-col h-full">
                                <Skeleton
                                    className={clsx([
                                        'flex flex-col justify-center grow min-h-[100px] min-w-[294px]  items-center z-0 w-full object-cover scale-[1.02] shadow-lg  border-4 rounded-[1em]',
                                        'dark:border-default light:border-neutral-200',
                                    ])}
                                />
                                <div className="flex p-1">
                                    <div className="flex flex-grow gap-2">
                                        <div className="flex gap-2 p-2 max-w-[300px]">
                                            <Skeleton className="font-bold text-left whitespace-pre-wrap rounded-lg">
                                                testdasdadsada
                                            </Skeleton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    })]}
                </div>
            </section>
        )
    }
    return (
        <div className="p-3 lg:p-5 flex flex-wrap gap-7">

            {updateableGames &&
                updateableGames.map(
                    (
                        e: Game & {
                            _count: { votes: number };
                            price: { final: number | string; currency: string };
                        },
                        i: number,
                    ) => {
                        const color =
                            i === 0 ? 'success' : i === 1 ? 'warning' : i === 2 ? 'secondary' : 'default';
                        const borderColor =
                            i === 0
                                ? 'border-success'
                                : i === 1
                                    ? 'border-warning'
                                    : i === 2
                                        ? 'border-secondary'
                                        : 'dark:border-default light:border-neutral-200';
                        return (
                            <Card
                                key={e.id}
                                isPressable
                                onPress={() => {
                                    router.push(`game/${e.id}`);
                                }}
                                isHoverable
                                className="overflow-visible max-w-[400px] min-w-[310px] grow min-h-[170px] cursor-pointer"
                            >

                                <div className="relative flex h-full">
                                    {/* create "default image" if no pic for game that is just logo and bg */}
                                    {e.picture === 'default' ? (
                                        <div
                                            className={clsx([
                                                'flex flex-col justify-center grow min-h-[100px] min-w-[294px]  items-center z-0 w-full object-cover scale-[1.02] shadow-lg  border-4 rounded-[1em]',
                                                borderColor,
                                            ])}
                                        >
                                            <Logo size={25} />
                                            <span className="!text-[10px] lowercase mt-1 font-bold">No Image </span>
                                        </div>
                                    ) : (
                                        // render game pic
                                        <Image
                                            isBlurred
                                            removeWrapper
                                            alt="Relaxing app background"
                                            shadow="sm"
                                            className={clsx([
                                                'z-0 w-full h-full object-cover scale-[1.033] max-h-[140px] border-4',
                                                borderColor,
                                            ])}
                                            src={e.picture}
                                        />
                                    )}
                                    {/* ranking and vote chip */}
                                    <Tooltip content="Ranking & Votes">
                                        <Chip
                                            className={clsx([
                                                'absolute  rankingChiptl text-2xl !font-black -left-[3px] boldChip',
                                            ])}
                                            variant="shadow"
                                            color={color}
                                        >
                                            <span className="!text-tiny opacity-50 font-mono">#</span>
                                            {i + 1}
                                            <span className="!text-tiny opacity-50">({e._count.votes})</span>
                                        </Chip>
                                    </Tooltip>
                                    {/* price chip */}
                                    {e.price.final === 'free' && (
                                        <div className=" absolute top-0 -right-[3px] opacity-70">
                                            <Chip
                                                size="sm"
                                                variant="shadow"
                                                className="!text-tiny uppercase rankingChiptr text-opacity-70"
                                            >
                                                {e.price.final}
                                            </Chip>
                                        </div>
                                    )}
                                    {typeof e.price.final === 'number' && (
                                        <div className=" absolute -right-[3px] -top-[1px]">
                                            <Chip
                                                color={color}
                                                size="sm"
                                                variant="shadow"
                                                className="!text-tiny rankingChiptr text-opacity-70"
                                            >
                                                {(e.price.final as number) / 100} <span className="text-[10px] font-bold">{e.price.currency}</span>
                                            </Chip>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-1 absolute bottom-3 left-2">
                                        {/* {e.categories && JSON.stringify(e.categories)} */}
                                        {e.categories &&
                                            Object.values(e.categories).map((e, i) => {
                                                if (i > 2) return;
                                                return (
                                                    <Chip
                                                        variant="flat"
                                                        className=" backdrop-blur"
                                                        key={e.description}
                                                        size="sm"
                                                    >
                                                        {e.description}
                                                    </Chip>
                                                );
                                            })}
                                    </div>
                                </div>
                                {/* footer */}
                                <div className="flex p-1 items-center">
                                    <div className="flex flex-grow gap-2">
                                        <div className="flex gap-2 p-2 max-w-[300px]">
                                            <Tooltip isDisabled={e.name.length < 27} content={e.name}>
                                                <h4 className="font-bold text-left whitespace-pre-wrap">
                                                    {e.name.substring(0, 27)}
                                                </h4>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    {e.link !== 'notOnSteam' && (
                                        <Tooltip content="Open Steam Page">
                                            <Link
                                                className="px-5"
                                                href={`https://store.steampowered.com/app/${e.steamId}`}
                                                target="_blank"
                                            >
                                                <Steamicon size={20} className="opacity-70" />
                                                {/* <ExternalLinkIcon color="gray" /> */}
                                            </Link>
                                        </Tooltip>
                                    )}
                                </div>
                            </Card>
                        );
                    },
                )}
        </div>
    )
}