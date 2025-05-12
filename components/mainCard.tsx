import { addToast } from '@heroui/toast';
import { Button, PressEvent } from '@heroui/button';
import { Card } from '@heroui/card';
import { Chip } from '@heroui/chip';
import clsx from 'clsx';
import Link from 'next/link';
import { Tooltip } from '@heroui/tooltip';
import NumberFlow from '@number-flow/react';
import { ClipboardIcon } from '@radix-ui/react-icons';
import { JsonArray } from '@prisma/client/runtime/library';
import { Image } from '@heroui/image';

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
      <div className="relative flex h-full w-full">
        {/* create "default image" if no pic for game that is just logo and bg */}

        <div
          className=" w-full relative"
        // className={clsx([
        //   'scale-[1.033] w-full h-[150px] relative rounded-[10px] border-4 ',
        //   borderColor,
        // ])}
        >
          {/* <div className=" w-full h-1/2 absolute top-0 left-0 bg-gradient-to-t z-10 from-transparent  to-[#0000000a]" />
          <div className=" w-full h-1/2 absolute bottom-0 left-0 bg-gradient-to-t z-10 from-[#00000028]  to-transparent" /> */}
          {e.picture === 'default' ? (
            <div
              className={clsx([
                'flex h-full min-h-[150px] justify-center items-center flex-col bg-content4 rounded-[10px] border-0',
                borderColor,
              ])}
            >
              <Logo size={25} />
              <span className="!text-[10px] lowercase mt-1 font-bold">No Image </span>
            </div>
          ) : (
            <Image
              isBlurred
              alt={e.name}
              classNames={{
                wrapper: '!max-w-full',
              }}
              src={cleanUrl(e.picture)}
              className={clsx([borderColor, 'border-0 w-full !max-w-full'])}
              // className={clsx([
              //   'rounded-[5px] transition-all duration-300 opacity-95 hover:opacity-100 z-0 w-full scale-[1.002] grow object-cover',
              //   borderColor,
              // ])}
              style={{
                maxWidth: "100%"
              }}
            />
          )}
          <Tooltip content={e.name}>
            <Chip
              className={
                'absolute rankingChiptl z-20 top-0 left-0 boldChip !w-[70%] overflow-hidden'
              }
              variant="shadow"
            >
              <div className="flex items-center w-full">
                <div className=" opacity-50 font-mono ">#</div>
                <div className=" press-start-2p-regular px-1">
                  <NumberFlow isolate value={i + 1} />
                </div>
                <div className="text-wrap w-full grow">{e.name.slice(0, 18)}</div>
              </div>
            </Chip>
          </Tooltip>
          <div className={'absolute z-20 flex items-end justify-between gap-2 -bottom-0 -right-0'}>
            <div>
              <Tooltip content={`Copy "!vote ${e.name}" to your clipboard`}>
                <Button
                  className="opacity-80 px-2 !border-none"
                  size="sm"
                  style={{ width: '30px', minWidth: 'unset' }}
                  variant="light"
                  onPress={() => {
                    navigator.clipboard.writeText(`!vote ${e.name}`);
                    addToast({
                      timeout: 2300,
                      color: 'success',
                      title: `"!vote ${e.name}" copied to clipboard`,
                    });
                  }}
                >
                  <ClipboardIcon height={15} width={12} />
                </Button>
              </Tooltip>
              {e.steamId > 0 && (
                <Tooltip content="Open Steam Page">
                  <Button
                    className="opacity-80  !border-none"
                    size="sm"
                    style={{ width: '30px', minWidth: 'unset' }}
                    variant="light"
                  >
                    <Link
                      className="px-5 z-10 relative"
                      href={`https://store.steampowered.com/app/${e.steamId}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Steamicon className="opacity-70" size={15} />
                    </Link>
                  </Button>
                </Tooltip>
              )}
            </div>
            <Chip
              // color={color}
              className="rankingChiptl"
              variant="shadow"
            >
              <div className="flex gap-1">
                <div className="flex flex-row gap-1 items-center text-xs">
                  <NumberFlow isolate willChange suffix={' votes'} value={e._count.votes} />
                </div>
              </div>
            </Chip>
          </div>
          {typeof e.price.final === 'string' && (
            <div className="absolute top-0 z-20 right-0">
              <Chip
                className="!text-tiny rankingChiptr text-opacity-70 absolute -top-0 -right-0"
                // color={color}
                size="sm"
                variant="shadow"
              >
                {e.price.final}
              </Chip>
            </div>
          )}
          {typeof e.price.final === 'number' && (
            <Chip
              className="!text-tiny rankingChiptr z-20 text-opacity-70 absolute -top-0 -right-0"
              // color={color}
              size="sm"
              variant="shadow"
            >
              {(e.price.final as number) / 100}{' '}
              <span className="text-[10px] font-bold">{e.price.currency}</span>
            </Chip>
          )}
          {Object.values(e.categories as JsonArray).length > 0 && (
            <div className="z-1 absolute -bottom-0 -left-0 p-0  w-1/2 overflow-hidden">
              <Chip
                className="!text-white backdrop-blur z-10 rankingChipbl"
                size="sm"
                variant="flat"
              >
                <div className="flex gap-3 z-0 lowercase text-[11px] opacity-80">
                  {e.categories &&
                    Object.values(e.categories)
                      .slice(0, 3)
                      .map((a) => {
                        return <div key={a.description}>{a.description}</div>;
                      })}
                </div>
              </Chip>
            </div>
          )}
        </div>
      </div>
      {/* footer */}
    </Card>
  );
};
