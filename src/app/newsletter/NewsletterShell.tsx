import Link from 'next/link';

// Shared frame for the small confirm / unsubscribe / status pages.
export default function NewsletterShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-pp py-16 md:py-24">
      <div className="max-w-xl mx-auto tile p-7 md:p-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h1>
        <div className="mt-4 text-[17px] text-ink-2 leading-relaxed space-y-4">{children}</div>
        <p className="mt-8 text-sm font-semibold text-muted">
          Questions? Email{' '}
          <a href="mailto:support@polishpal.pl" className="text-ink underline underline-offset-2">
            support@polishpal.pl
          </a>{' '}
          · <Link href="/" className="text-ink underline underline-offset-2">Home</Link>
        </p>
      </div>
    </div>
  );
}
