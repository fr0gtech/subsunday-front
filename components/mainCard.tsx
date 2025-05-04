import { addToast, Button, Card, Chip, PressEvent } from '@heroui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { Tooltip } from '@heroui/react';
import { Logo, Steamicon } from './icons';
import { gameNcount } from './mainItem';
import NumberFlow from '@number-flow/react';
import { ClipboardIcon } from '@radix-ui/react-icons';
import NextImage from 'next/image';
export const MainCard = ({
  e,
  i,
  onPress,
  className,
}: {
  e: gameNcount;
  i: number;
  onPress: (e: PressEvent) => void;
  className?: string;
}) => {
  const color = i === 0 ? 'success' : i === 1 ? 'warning' : i === 2 ? 'secondary' : 'default';
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
      onPress={onPress}
      isPressable
      as={"div"}
      // onPress={() => router.push(`game/${e.id}`)}
      isHoverable
      className={className}
    >
      <div className="relative flex h-full">
        {/* create "default image" if no pic for game that is just logo and bg */}
        <div className={clsx(['scale-[1.033] w-full h-full relative rounded-[10px] border-4', borderColor])}>
          {e.picture === 'default' ? (
            <div
              className={clsx([
                'flex flex-col justify-center h-full bg-neutral-100 dark:bg-neutral-900 min-h-[100px] min-w-[294px] items-center z-0  object-cover shadow-lg  ',
                borderColor,
              ])}
            >
              <Logo size={25} />
              <span className="!text-[10px] lowercase mt-1 font-bold">No Image </span>
            </div>
          ) : (
            <div className='h-[130px]'>

              <NextImage
                src={e.picture}
                fill
                loading="lazy"
                className={clsx([
                  'z-0 w-full grow object-cover',
                  borderColor,
                ])}
                alt={e.name}
              />
            </div>

          )}
          <Tooltip content="Ranking & Votes">
            <Chip
              className={clsx(['absolute rankingChiptl -top-[2px] -left-[2px] boldChip !w-[200px]'])}
              variant="shadow"
              color={color}
            >
              <div className="flex items-center">
                <div className=" opacity-50 font-mono">#</div>
                <div className="text-2xl">
                  <NumberFlow isolate value={i + 1} />
                </div>
                <div className="top-0 right-0 opacity-50 !text-tiny h-full">
                  (<NumberFlow isolate className="left-0 bottom-0" value={e._count.votes} />)
                </div>
              </div>
            </Chip>
          </Tooltip>
          {typeof e.price.final === 'string' && (
            <div className="absolute top-0 right-0">
              <Chip
                color={color}
                size="sm"
                variant="shadow"
                className="!text-tiny rankingChiptr text-opacity-70 absolute -top-[2px] -right-[2px]"
              >
                {e.price.final}
              </Chip>
            </div>
          )}
          {typeof e.price.final === 'number' && (
            <Chip
              color={color}
              size="sm"
              variant="shadow"
              className="!text-tiny rankingChiptr text-opacity-70 absolute -top-[2px] -right-[2px]"
            >
              {(e.price.final as number) / 100}{' '}
              <span className="text-[10px] font-bold">{e.price.currency}</span>
            </Chip>
          )}
        </div>
        <div className="flex flex-wrap gap-1 absolute bottom-3 left-2">
          {/* {e.categories && JSON.stringify(e.categories)} */}
          {e.categories &&
            Object.values(e.categories).map((e, i) => {
              if (i > 2) return;
              return (
                <Chip variant="flat" className=" backdrop-blur" key={e.description} size="sm">
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
              <h4 className="font-bold text-left whitespace-pre-wrap">{e.name.substring(0, 27)}</h4>
            </Tooltip>
          </div>
        </div>
        <div className='flex gap-2 mr-1'>
          <Tooltip content={`Copy "!vote ${e.name}" to your clipboard`}>
            <Button size='sm' variant='ghost' className='opacity-50 px-2 !border-none'
              style={{ width: "30px", minWidth: "unset" }}
              onPress={() => {
                navigator.clipboard.writeText(`!vote ${e.name}`);
                addToast({ timeout: 2300, color: 'success', title: `"!vote ${e.name}" copied to clipboard` })
              }}
            >
              <ClipboardIcon />
            </Button>
          </Tooltip>
          {e.link !== 'notOnSteam' && (
            <Tooltip content="Open Steam Page">
              <Button size='sm' variant='ghost' className='opacity-50  !border-none'
                style={{ width: "30px", minWidth: "unset" }}
              >
                <Link
                  onClick={(e) => e.stopPropagation()}
                  className="px-5 z-10 relative"
                  href={`https://store.steampowered.com/app/${e.steamId}`}
                  target="_blank"
                >
                  <Steamicon size={20} className="opacity-70" />
                </Link>
              </Button>

            </Tooltip>
          )}
        </div>
      </div>
    </Card>
  );
};
