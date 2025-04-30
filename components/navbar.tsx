'use client';
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar';
import NextLink from 'next/link';

import { GithubIcon, Logo } from '@/components/icons';
import { ThemeSwitch } from './theme-switch';
import { siteConfig } from '@/config/site';
import clsx from 'clsx';
import { link as linkStyles } from '@heroui/theme';
import { Button, Link, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { fetcher } from '@/app/lib';
import useSWR from 'swr';
import { CurrentVotes } from './currentVotes';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { InfoCircledIcon } from '@radix-ui/react-icons';
export const Navbar = () => {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  return (
    <HeroUINavbar isMenuOpen={menuOpen} maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <Logo size={25} />
            <p className="font-bold text-inherit">Sub Sunday</p>
          </NextLink>
        </NavbarBrand>

        <ul className="hidden lg:flex gap-4 justify-start ml-10">
          {siteConfig.navItems.map((item) => (
            <NavbarItem
              isActive={path === item.href}
              key={item.href}
              className={clsx(
                linkStyles({ color: 'foreground' }),
                'data-[active=true]:text-primary data-[active=true]:font-bold',
                '!text-sm !text-foreground',
              )}
            >
              <NextLink color={'foreground'} href={item.href}>
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item}-${index}`}
              isActive={path === item.href}
              className={clsx(
                linkStyles({ color: 'foreground' }),
                'data-[active=true]:!text-forground data-[active=true]:font-bold',
                '!text-sm !text-foreground',
              )}
            >
              <Link
                color={'foreground'}
                href={item.href}
                size="lg"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
      <CurrentVotes className={'hidden gap-5 lg:flex text-tiny lowercase'} />
      <NavbarContent className=" basis-1 pl-4" justify="end">

        <Link href='/info'>
          <GithubIcon className="text-default-500" />
        </Link>

        <ThemeSwitch />
        <NavbarMenuToggle onClick={() => setMenuOpen(!menuOpen)} className="flex lg:hidden" />
      </NavbarContent>
    </HeroUINavbar>
  );
};
