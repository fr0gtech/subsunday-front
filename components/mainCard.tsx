import { addToast } from '@heroui/toast';
import { Button, PressEvent } from '@heroui/button';
import { Card } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import clsx from 'clsx';
import Link from 'next/link';
import { Tooltip } from '@heroui/tooltip';
import NumberFlow from '@number-flow/react';
import { ClipboardIcon } from '@radix-ui/react-icons';
import NextImage from 'next/image';
import { JsonArray } from '@prisma/client/runtime/library';

import { gameNcount } from './mainItem';
import { Logo, Steamicon } from './icons';

import { cleanUrl } from '@/app/lib';
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
          : 'border-default';

  return (
    <Card
      key={e.id}
      isPressable
      as={'div'}
      className={className}
      isHoverable={true}
      onPress={onPress}
    >
      <div className="relative flex h-full">
        {/* create "default image" if no pic for game that is just logo and bg */}
        <div
          className={clsx([
            'scale-[1.033] w-full h-full relative rounded-[10px] border-4',
            borderColor,
          ])}
        >
          {e.picture === 'default' ? (
            <div
              className={clsx([
                'flex flex-col transition-all duration-300 opacity-95 hover:opacity-100 rounded-[5px] justify-center h-full bg-neutral-100 dark:bg-neutral-900 min-h-[100px] min-w-[294px] items-center z-0  object-cover shadow-lg  ',
                borderColor,
              ])}
            >
              <Logo size={25} />
              <span className="!text-[10px] lowercase mt-1 font-bold">No Image </span>
            </div>
          ) : (
            <div className="">
              <NextImage
                fill
                alt={e.name}
                className={clsx([
                  'rounded-[5px] transition-all duration-300 opacity-95 hover:opacity-100 z-0 w-full scale-[1.002] grow object-cover',
                  borderColor,
                ])}
                loading="lazy"
                quality={75}
                src={cleanUrl(e.picture)}
              />
            </div>
          )}
          <Tooltip content="Ranking & Votes">
            <Chip
              className={clsx([
                'absolute rankingChiptl -top-[2px] -left-[2px] boldChip !w-[200px]',
              ])}
              color={color}
              variant="shadow"
            >
              <div className="flex items-center">
                <div className=" opacity-50 font-mono ">#</div>
                <div className="text-xl press-start-2p-regular px-1">
                  <NumberFlow isolate value={i + 1} />
                </div>
              </div>
            </Chip>
          </Tooltip>
          <Chip
            className={clsx(['absolute rankingChiptl -bottom-[2px] -right-[2px] !w-[200px]'])}
            color={color}
            variant="shadow"
          >
            <div className="flex flex-row gap-1 items-center text-xs">
              <NumberFlow isolate willChange prefix="votes: " value={e._count.votes} />
            </div>
          </Chip>
          {typeof e.price.final === 'string' && (
            <div className="absolute top-0 right-0">
              <Chip
                className="!text-tiny rankingChiptr text-opacity-70 absolute -top-[2px] -right-[2px]"
                color={color}
                size="sm"
                variant="shadow"
              >
                {e.price.final}
              </Chip>
            </div>
          )}
          {typeof e.price.final === 'number' && (
            <Chip
              className="!text-tiny rankingChiptr text-opacity-70 absolute -top-[2px] -right-[2px]"
              color={color}
              size="sm"
              variant="shadow"
            >
              {(e.price.final as number) / 100}{' '}
              <span className="text-[10px] font-bold">{e.price.currency}</span>
            </Chip>
          )}
          {Object.values(e.categories as JsonArray).length > 0 && (
            <Chip
              className="w-full absolute bottom-0 -left-[1px] p-0 rankingChipbl lowercase text-tiny font-bold"
              color={color}
            >
              {/* {e.categories && JSON.stringify(e.categories)} */}
              <div className="flex flex-row gap-2  items-center">
                {e.categories &&
                  Object.values(e.categories).map((a, i) => {
                    const last = i === Object.values(e.categories as JsonArray).length - 1;

                    return (
                      <div key={a.description} className="flex flex-row items-center gap-1">
                        <div>{a.description}</div>
                        {!last && <Divider className="h-4" orientation="vertical" />}
                      </div>
                    );
                  })}
              </div>
            </Chip>
          )}
        </div>
      </div>
      {/* footer */}
      <div className="flex p-1 items-center">
        <div className="flex flex-grow gap-2">
          <div className="flex gap-2 p-2 max-w-[300px]">
            <Tooltip content={e.name} isDisabled={e.name.length < 27}>
              <h4 className="text-xl font-medium text-left whitespace-pre-wrap">
                {e.name.substring(0, 23)}
              </h4>
            </Tooltip>
          </div>
        </div>
        <div className="flex gap-2 mr-1">
          <Tooltip content={`Copy "!vote ${e.name}" to your clipboard`}>
            <Button
              className="opacity-50 px-2 !border-none"
              size="sm"
              style={{ width: '30px', minWidth: 'unset' }}
              variant="ghost"
              onPress={() => {
                navigator.clipboard.writeText(`!vote ${e.name}`);
                addToast({
                  timeout: 2300,
                  color: 'success',
                  title: `"!vote ${e.name}" copied to clipboard`,
                });
              }}
            >
              <ClipboardIcon />
            </Button>
          </Tooltip>
          {e.link !== 'notOnSteam' && (
            <Tooltip content="Open Steam Page">
              <Button
                className="opacity-50  !border-none"
                size="sm"
                style={{ width: '30px', minWidth: 'unset' }}
                variant="ghost"
              >
                <Link
                  className="px-5 z-10 relative"
                  href={`https://store.steampowered.com/app/${e.steamId}`}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Steamicon className="opacity-70" size={20} />
                </Link>
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </Card>
  );
};
