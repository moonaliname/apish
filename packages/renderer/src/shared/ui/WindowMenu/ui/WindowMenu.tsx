import { send } from "@apish/preload";
import { IconMinus, IconX } from "@tabler/icons-react";

import { ActionIcon } from "@shared/ui/ActionIcon";

import { ToggleMaximize } from "./ToggleMaximize";

export const WindowMenu = () => {
  return (
    <div className="flex">
      <ActionIcon
        variant="subtle"
        color="gray"
        aria-label="Minimize"
        onClick={() => {
          send("windowMinimize");
        }}
      >
        <IconMinus style={{ width: "70%", height: "70%" }} />
      </ActionIcon>

      <ToggleMaximize />

      <ActionIcon
        variant="subtle"
        color="gray"
        aria-label="Close"
        onClick={() => {
          send("windowClose");
        }}
      >
        <IconX style={{ width: "70%", height: "70%" }} />
      </ActionIcon>
    </div>
  );
};
