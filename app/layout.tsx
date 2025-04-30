import '@/styles/globals.css';
import clsx from 'clsx';
import { Providers } from './providers';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'Sub Sunday',
  description: "A website to track lirik's sub sunday votes.",
  openGraph: {
    title: 'Sub Sunday',
    description: "A website to track lirik's sub sunday votes.",
    images: { images: ['https://sub-sunday.com/og.png'] },
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?noCache=1" sizes="any" />
      </head>
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className="relative flex h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full flex-grow">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
