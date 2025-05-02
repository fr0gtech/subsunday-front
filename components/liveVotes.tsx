import { fetcher, socket } from "@/app/lib";
import { Vote } from "@/generated/prisma";
import { useEffect, useMemo, useState } from "react";
import { Voted } from "./voted";
import useSWR from "swr";
import { v4 as uuidv4 } from 'uuid';

export const LiveVotes = ({amount, bg = true, textRight=false}:{amount: number, bg?: boolean,textRight?:boolean}) => {
    const [msgEvents, setMsgEvents] = useState<any>([]);
    const { data } = useSWR(`/api/votes?amount=${amount}`, fetcher);

    useEffect(() => {
        function onMsgEvent(value: any) {
            setMsgEvents((previous: any) => [...previous, value] as any);
        }
        socket.emit('join', 'main');
        socket.on('vote', onMsgEvent);

        return () => {
            socket.emit('leave', 'main');
            socket.off('vote', onMsgEvent);
        };
    }, []);

    const liveVotes = useMemo(() => {
        if (!data) return;
        const wsVotes2Votes = msgEvents.map(
            (e: { for: { id: number; name: string }; from: { id: number; name: string } }) => {
                return {
                    createdAt: new Date(),
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
            },
        );

        return [...wsVotes2Votes, ...data.votes];
    }, [msgEvents, data]);

    return (
        <div className="space-y-2 grow ">
            {liveVotes &&
                liveVotes.map(
                    (
                        e: Vote & { from: { name: string; id: number } } & {
                            for: { id: number; name: string };
                        },
                        i: number,
                    ) => {
                        return <Voted key={e.id} vote={e} bg={bg} textRight={textRight} />;
                    },
                )}
        </div>
    )
}