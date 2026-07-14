import { FooterControls } from "@/components/footer-controls";
import { HeaderControls } from "@/components/header-controls";
import { MainLayout } from "@/components/main-layout";
import { ProviderPanel } from "@/components/provider-panel";
import { ConfigProvider } from "@/contexts/config-context";
import { TtsProvider } from "@/contexts/tts-context";
import { PROVIDERS } from "@/lib/providers";

function App() {
  return (
    <ConfigProvider>
      <AppCore />
    </ConfigProvider>
  );
}

function AppCore() {
  return (
    <TtsProvider>
      <MainLayout
        headerControlsContent={<HeaderControls />}
        footerContent={<FooterControls />}
        mainContent={
          <div className="h-full flex flex-col gap-3 p-3 overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-3 min-h-0">
              {PROVIDERS.map((provider) => (
                <ProviderPanel key={provider} provider={provider} />
              ))}
            </div>
          </div>
        }
      />
    </TtsProvider>
  );
}

export default App;
