import type { ReactNode } from "react";
import { Header } from "@/components/header";

type Props = {
  mainContent: ReactNode;
  footerContent?: ReactNode;
  headerControlsContent?: ReactNode;
};

export const MainLayout = ({
  mainContent,
  footerContent,
  headerControlsContent,
}: Props) => {
  return (
    <div className="w-full h-dvh flex flex-col font-sans antialiased bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 overflow-hidden">
      <Header controls={headerControlsContent} />

      <div className="flex flex-row flex-1 min-h-0">
        <main className="flex-grow relative flex flex-col min-h-0">
          <div className="w-full flex-1 min-h-0">{mainContent}</div>
        </main>
      </div>

      {footerContent && (
        <footer className="shrink-0 flex items-center gap-3 min-h-16 px-4 py-3 border-t border-gray-200 bg-zinc-50 dark:border-gray-800 dark:bg-gray-900">
          {footerContent}
        </footer>
      )}
    </div>
  );
};
