import HeaderApp from "@/components/layout/header";
import { ThemeProvider } from "@/provider/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="border-b bg-sidebar">
        <HeaderApp />
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-h-[calc(100vh-3rem-5rem-1px)] overflow-auto bg-sidebar">
        <div className="container mx-auto max-w-6xl px-4">
          {children}
        </div>
      </main>
    </div>
  );
}