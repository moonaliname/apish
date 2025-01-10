import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MainPage } from "@pages/main";

import "./styles.css";

const theme = createTheme({ scale: 0.8 });

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

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
