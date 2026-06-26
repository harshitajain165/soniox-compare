import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MainLayoutProps {
  mainContent: React.ReactNode;
  footerContent?: React.ReactNode;
  headerControlsContent?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  mainContent,
  footerContent,
  headerControlsContent,
}) => {
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

const Header: React.FC<{ controls?: React.ReactNode }> = ({ controls }) => {
  return (
    <header className="shrink-0 flex items-center justify-between gap-2 h-14 px-4 border-b border-gray-200 bg-zinc-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <img
          src="/compare/ui/soniox-compare.svg"
          alt="Soniox Compare Logo"
          className="h-6"
        />
      </div>
      <TooltipProvider>
        <div className="flex items-center gap-3">{controls}</div>
      </TooltipProvider>
    </header>
  );
};
