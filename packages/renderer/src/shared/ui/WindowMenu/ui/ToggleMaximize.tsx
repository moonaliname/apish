import { IconWindowMaximize, IconWindowMinimize } from "@tabler/icons-react";

import { ActionIcon } from "@shared/ui/ActionIcon";

import { useToggleMaximize } from "../model/useToggleMaximize";

export const ToggleMaximize = () => {
  const { label, isMaximized, toggleMaximize } = useToggleMaximize();
  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      aria-label={label}
      onClick={() => toggleMaximize()}
    >
      {isMaximized ? (
        <IconWindowMinimize style={{ width: "70%", height: "70%" }} />
      ) : (
        <IconWindowMaximize style={{ width: "70%", height: "70%" }} />
      )}
    </ActionIcon>
  );
};
