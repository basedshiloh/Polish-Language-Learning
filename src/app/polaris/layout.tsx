import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Polaris',
};

export default function PolarisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
