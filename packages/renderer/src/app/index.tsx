import { IPC_PING_PATH, IPingRequest, IPingResponse } from "@apish/common";
import { send } from "@apish/preload";
import { useEffect, useState } from "react";

import { Upload } from "@features/schema/upload";

import reactLogo from "@assets/react.svg";

import "./styles.css";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const testFn = async () => {
      const result = await send<IPingRequest, IPingResponse>(IPC_PING_PATH, {
        id: 1,
      });
      console.log("result", result);
    };

    testFn();
  }, []);

  return (
    <>
      <Upload />
      <div className="flex gap-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
