import type { Metadata } from 'next';
import { isAuthed } from '@/lib/cms-auth';
import CmsLogin from '@/components/cms/CmsLogin';
import CmsShell from '@/components/cms/CmsShell';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'PolishPal CMS',
};

export default async function PolarisLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthed();
  if (!authed) return <CmsLogin />;
  return <CmsShell>{children}</CmsShell>;
}
