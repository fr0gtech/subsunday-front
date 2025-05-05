import { Image } from '@heroui/react';

const getStreakStage = (streak: number) => {
  if (streak >= 52) return 'blazing5';
  if (streak >= 40) return 'blazing4';
  if (streak >= 30) return 'blazing3';
  if (streak >= 20) return 'blazing2';
  if (streak >= 10) return 'blazing';
  if (streak >= 5) return 'burning';
  if (streak >= 3) return 'kindled';
  if (streak === 0) return 'none';

  return 'ember';
};

const stageMap = {
  ember: {
    label: 'Ember',
    src: '/particles/Fire+Sparks.gif',
    picClass: 'brightness-[0.3] grayscale',
  },
  kindled: { label: 'Kindled', src: '/particles/Fire+Sparks.gif', picClass: 'brightness-[1]' },
  burning: { label: 'Burning', src: '/particles/Fire+Sparks.gif', picClass: 'brightness-[2]' },
  blazing: {
    label: 'Blazing',
    src: '/particles/Fire+Sparks.gif',
    picClass: 'brightness-[3] hue-rotate-30',
  },
  blazing2: {
    label: 'Blazing',
    src: '/particles/Fire+Sparks.gif',
    picClass: 'brightness-[4] hue-rotate-50',
  },
  blazing3: {
    label: 'Blazing',
    src: '/particles/Fire+Sparks.gif',
    picClass: 'brightness-[5] hue-rotate-100',
  },
  blazing4: {
    label: 'Blazing',
    src: '/particles/Fire+Sparks.gif',
    picClass: 'brightness-[6] hue-rotate-150',
  },
  blazing5: {
    label: 'Blazing',
    src: '/particles/Fire+Sparks.gif',
    picClass: 'brightness-[7] hue-rotate-200',
  },
  none: {
    label: '',
    src: '',
    picClass: '',
  },
};

export default function StreakDisplay({
  streak,
  className,
}: {
  streak: number;
  className: string;
}) {
  const stage = getStreakStage(streak);
  const { label, src, picClass } = stageMap[stage];

  return (
    <div className={className}>{src && <Image alt={label} className={picClass} src={src} />}</div>
  );
}
