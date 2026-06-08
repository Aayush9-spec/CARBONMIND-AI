import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-64">
        <Header />
        <main
          id="main-content"
          className="flex-1 p-6"
          role="main"
          aria-label="Dashboard content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
