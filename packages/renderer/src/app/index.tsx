import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MainPage } from "@pages/main";

import "./styles.css";

const theme = createTheme({});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <MainPage />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
