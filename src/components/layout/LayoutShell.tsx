import Topbar from './Topbar';
import Footer from './Footer';
import AccessibilityPanel from './AccessibilityPanel';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      <main className="min-h-screen overflow-x-clip">
        {children}
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}
