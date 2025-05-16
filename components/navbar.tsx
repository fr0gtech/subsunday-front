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
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { GridIcon, LayoutIcon } from '@radix-ui/react-icons';
import { Button } from '@heroui/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';

import { ThemeSwitch } from './theme-switch';
import WeeklyCalendar from './weeklyCalendar';
import WeeklyCalendarPopover from './weeklyCalendarPopover';
import { CurrentVotes } from './currentVotes';
import { VotingPeriod } from './votingPeriod';

import { siteConfig } from '@/config/site';
import { GithubIcon, Logo, SearchIcon } from '@/components/icons';
import { useAppStore } from '@/store/store';
export const Navbar = () => {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set(['icon']));
  const { setListlayout } = useAppStore();
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
    [selectedKeys],
  );

  useEffect(() => {
    setListlayout(selectedValue);
  }, [selectedValue]);
  const searchBar = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      labelPlacement="outside"
      placeholder="Search..."
      size="sm"
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
    <HeroUINavbar className="fixed" isMenuOpen={menuOpen} maxWidth="full" position="sticky">
      <NavbarContent className="  justify-between w-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-2">
          <Logo size={25} />
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <h1 className="font-bold text-inherit">Sub Sunday</h1>
          </NextLink>
          <div className="absolute ml-7 bottom-2">
            <div className="flex gap-1 text-tiny opacity-50 ">
              *<div> unofficial</div>{' '}
            </div>
          </div>
        </NavbarBrand>
        <NavbarItem className="hidden lg:block">
          <VotingPeriod className="text-sm h-full" />
        </NavbarItem>
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
                <Button size="sm">{item.label}</Button>
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
        <NavbarItem className="hidden lg:block">
          <WeeklyCalendarPopover />
        </NavbarItem>
        <NavbarItem className="hidden lg:block">
          <Dropdown>
            <DropdownTrigger>
              <Button size="sm">{selectedValue === 'icon' ? <GridIcon /> : <LayoutIcon />}</Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              variant="flat"
              onSelectionChange={setSelectedKeys}
            >
              <DropdownItem key={'icon'}>
                <span>
                  <GridIcon className="inline mr-2" />
                  Icon View
                </span>
              </DropdownItem>
              <DropdownItem key={'list'}>
                <span>
                  <LayoutIcon className="inline mr-2" />
                  List View
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden xl:block">
          <CurrentVotes className="flex gap-2 items-center justify-center text-xs px-2 h-10 rounded-xl opacity-85" />
        </NavbarItem>
        <NavbarItem className="hidden lg:block">{searchBar}</NavbarItem>
        <NextLink href="/info">
          <GithubIcon className="text-default-500" />
        </NextLink>
        <ThemeSwitch />
        <NavbarMenuToggle className="flex lg:hidden" onClick={() => setMenuOpen(!menuOpen)} />
      </NavbarContent>
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
      {/* <NavbarItem className="hidden lg:block">
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
      </NavbarItem> */}
      {/* <CurrentVotes className={'font-bold hidden gap-5 lg:flex text-tiny lowercase'} /> */}
    </HeroUINavbar>
  );
};
