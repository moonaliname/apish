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
        <IconWindowMinimize className="w-9/12 h-9/12" />
      ) : (
        <IconWindowMaximize className="w-9/12 h-9/12" />
      )}
    </ActionIcon>
  );
};
