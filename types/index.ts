import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type wsMsg = {
  for: {
    name: string;
    id: number;
  };
  from: { name: string; id: number };
};
