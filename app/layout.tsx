import './globals.css';
import clsx from 'clsx';
import { Press_Start_2P, VT323 } from 'next/font/google';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { GoogleAnalytics } from '@next/third-parties/google'
import { Providers } from './providers';
import type { ThemeProviderProps } from 'next-themes';

import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';
import { Link } from '@heroui/link';
import Script from 'next/script';
export const metadata = {
  title: "Sub Sunday - Tracking votes for lirik's sub sunday.",
  description:
    "A website to track lirik's sub sunday votes. With game info, direct link to steam and more.",
  openGraph: {
    title: 'Sub Sunday',
    description:
      "A website to track lirik's sub sunday votes. With game info, direct link to steam and more.",
    images: ['https://sub-sunday.com/og.png'],
  },
};
const ps2 = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});
const vt = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className='dark'>
      <head>
        <meta name="apple-mobile-web-app-title" content="sub-sunday" />
      </head>
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          ps2,
          vt,
        )}
      >
          <NextThemesProvider enableSystem attribute={'class'} defaultTheme="dark">
        <Providers>
          <div className="relative flex flex-col">
            <Navbar />
            <main className="mx-auto w-full grow flex">{children}</main>
            <footer className="p-5 w-full flex justify-center mt-5">
              <Link color="foreground" href="https://frogtech.dev">
                <span className=" text-center w-full opacity-75 text-tiny">by frogtech.dev</span>
              </Link>
            </footer>
          </div>
        </Providers>
    </NextThemesProvider>
      </body>
      <GoogleAnalytics gaId="G-KQXTZDJW2F" />
    </html> 
  );
}
