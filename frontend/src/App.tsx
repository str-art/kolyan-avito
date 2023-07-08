import { TelegramProvider } from "./contexts/TelegramProvider";
import { ClientProvider } from "./contexts/ClientsProvider";
import { Theme } from "./contexts/ThemeProvider";
import { Layout } from "./components/Layout";
import { ScheduleProvider } from "./contexts/SchedulesProvider";
import { HomePage } from "./pages/home";
import { AlertProvider } from "./contexts/AlertProvider";

function App() {
  return (
    <Layout
      main={
        <TelegramProvider>
          <ClientProvider>
            <Theme>
              <AlertProvider>
                <ScheduleProvider>
                  <HomePage />
                </ScheduleProvider>
              </AlertProvider>
            </Theme>
          </ClientProvider>
        </TelegramProvider>
      }
    />
  );
}

export default App;
