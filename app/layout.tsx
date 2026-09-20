import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Backstop — In-Process Reliability Layer for AI SDKs',
  description:
    'Backstop is an in-process reliability layer for AI SDKs providing backpressure, budget enforcement, circuit breaking, and telemetry for multi-agent workflows.',
  openGraph: {
    title: 'Backstop — In-Process Reliability Layer for AI SDKs',
    description:
      'Backstop is an in-process reliability layer for AI SDKs providing backpressure, budget enforcement, circuit breaking, and telemetry for multi-agent workflows.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backstop — In-Process Reliability Layer for AI SDKs',
    description:
      'Backstop is an in-process reliability layer for AI SDKs providing backpressure, budget enforcement, circuit breaking, and telemetry for multi-agent workflows.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-background text-foreground antialiased selection:bg-secondary selection:text-secondary-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
