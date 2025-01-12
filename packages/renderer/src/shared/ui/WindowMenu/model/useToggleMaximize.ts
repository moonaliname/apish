import { invoke, send } from "@apish/preload";
import { useEffect, useState } from "react";

export const useToggleMaximize = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  async function getIsMaximized() {
    const isMaxmizableResult = await invoke("windowGetIsMaximized");

    if ("data" in isMaxmizableResult) {
      setIsMaximized(isMaxmizableResult.data);
    }
  }

  useEffect(() => {
    getIsMaximized();
  });

  const toggleMaximize = () => {
    setIsMaximized((prevState) => !prevState);
    send("windowToggleMaximize");
  };

  return {
    isMaximized,
    label: isMaximized ? "Maximize" : "Unmaximize",
    toggleMaximize,
  };
};
