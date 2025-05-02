import { Card, Chip } from "@heroui/react";
import clsx from "clsx";
import { color } from "framer-motion";
import Link from "next/link";
import { Image, Tooltip } from "@heroui/react";
import { Logo, Steamicon } from "./icons";
import { gameNcount } from "./mainItem";
import { useRouter } from "next/navigation";

export const MainCard = ({e,i}:{e:gameNcount, i:number}) =>{
        const router = useRouter();
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
        onPress={() =>router.push(`game/${e.id}`)}
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
            {typeof e.price.final === 'string' && (
                <div className="absolute -right-[3px] -top-[1px]">
                    <Chip
                        color={color}
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
                        onClick={(e) => e.stopPropagation()}
                        className="px-5 z-10 relative"
                        href={`https://store.steampowered.com/app/${e.steamId}`}
                        target="_blank"
                    >
                        <Steamicon size={20} className="opacity-70" />
                    </Link>
                </Tooltip>
            )}
        </div>
    </Card>
    )
}