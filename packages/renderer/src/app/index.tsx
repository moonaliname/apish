import { send } from "@apish/preload";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { useEffect } from "react";

import { MainPage } from "@pages/main";

import "./styles.css";

const theme = createTheme({});

function App() {
  useEffect(() => {
    const testFn = async () => {
      const result = await send("ping", {
        id: 1,
      });
      console.log("result", result);
    };

    testFn();
  }, []);

  return (
    <MantineProvider theme={theme}>
      <MainPage />
    </MantineProvider>
  );
}

export default App;
