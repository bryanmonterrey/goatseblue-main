// layout.tsx
import { Metadata } from 'next';
import { metadata as pageMetadata } from './metadata';
import ClientLayout from './layoutClient';

import "./globals.css";

export const metadata: Metadata = pageMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            </head>
            <body>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}