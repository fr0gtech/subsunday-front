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
import clsx from 'clsx';
import { link as linkStyles } from '@heroui/theme';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { InfoCircledIcon } from '@radix-ui/react-icons';

import { ThemeSwitch } from './theme-switch';
import WeeklyCalendar from './weeklyCalendar';
import WeeklyCalendarPopover from './weeklyCalendarPopover';

import { siteConfig } from '@/config/site';
import { GithubIcon, Logo, SearchIcon } from '@/components/icons';

export const Navbar = () => {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  const searchBar = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      size='sm'
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setMenuOpen(menuOpen ? false : menuOpen);
          router.push('/search?value=' + e.currentTarget.value);
        }
      }}
    />
  );

  return (
    <HeroUINavbar isMenuOpen={menuOpen} maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <Logo size={25} />
            <h1 className="font-bold text-inherit">Sub Sunday</h1>
          </NextLink>
        </NavbarBrand>

        <ul className="hidden lg:flex gap-4 justify-start ml-10">
          {siteConfig.navItems.map((item) => (
            <NavbarItem
              key={item.href}
              className={clsx(
                linkStyles({ color: 'foreground' }),
                'data-[active=true]:text-primary data-[active=true]:font-bold',
                '!text-sm !text-foreground',
              )}
              isActive={path === item.href}
            >
              <NextLink color={'foreground'} href={item.href}>
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>
      <NavbarItem className="hidden lg:block">
        <WeeklyCalendarPopover />
      </NavbarItem>
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-5">
          {searchBar}

          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item}-${index}`}
              className={clsx(
                linkStyles({ color: 'foreground' }),
                'data-[active=true]:!text-forground data-[active=true]:font-bold',
                '!text-sm !text-foreground',
              )}
              isActive={path === item.href}
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
          <div className="mt-10">
            <WeeklyCalendar />
          </div>
        </div>
      </NavbarMenu>
      <NavbarItem className="hidden lg:block">
        <div className="text-xs flex flex-row gap-2 items-center !leading">
          *
          <div>
            {' '}
            this is <b>not</b> an official sub sunday website
          </div>{' '}
          <NextLink href={'/info'}>
            <InfoCircledIcon />
          </NextLink>
        </div>
      </NavbarItem>
      {/* <CurrentVotes className={'font-bold hidden gap-5 lg:flex text-tiny lowercase'} /> */}

      <NavbarContent className=" basis-1 pl-4" justify="end">
        <NavbarItem className="hidden lg:block">{searchBar}</NavbarItem>
        <NextLink href="/info">
          <GithubIcon className="text-default-500" />
        </NextLink>
        <ThemeSwitch />
        <NavbarMenuToggle className="flex lg:hidden" onClick={() => setMenuOpen(!menuOpen)} />
      </NavbarContent>
    </HeroUINavbar>
  );
};
