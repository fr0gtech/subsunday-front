import { Game } from "@/generated/prisma";
import { addToast, Card, Chip, Divider, Image, Skeleton, Tooltip } from "@heroui/react";
import clsx from "clsx";
import Link from "next/link";
import { Logo, Steamicon } from "./icons";
import { socket, fetcher } from "@/app/lib";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useSWR from "swr";
import { wsMsg } from "@/types";
import { LiveVotes } from "./liveVotes";
import { MainCard } from "./mainCard";
export type gameNcount = Game & {
    _count: { votes: number };
    price: { final: number | string; currency: string }
}
export const MainItem = () => {
    const [msgEvents, setMsgEvents] = useState<wsMsg[]>([]);


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

    const updateableGames = useMemo<gameNcount[]>(() => {
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
        <div className="flex p-3 w-full">
            <div className="container2 w-full">
                {updateableGames &&
                    updateableGames.map(
                        (e, i: number,
                        ) => {
                            return (
                                <MainCard key={e.id} e={e} i={i} />
                            );
                        },
                    )}
                <div className="fixed2 relative w-full h-full overflow-hidden">
                    <div className="absolute w-full h-full top-0 left-0 whitespace-nowrap overflow-hidden2">
                        <LiveVotes amount={3} bg={false} textRight />
                    </div>
                </div>
            </div>
            <Divider className="hidden lg:visible" />

        </div>

    )
}