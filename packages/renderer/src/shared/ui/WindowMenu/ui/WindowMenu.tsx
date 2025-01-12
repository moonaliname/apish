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
        <IconMinus className="w-9/12 h-9/12" />
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
        <IconX className="w-9/12 h-9/12" />
      </ActionIcon>
    </div>
  );
};
