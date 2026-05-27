import HeaderApp from "@/components/layout/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="border-b">
        <HeaderApp />
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}