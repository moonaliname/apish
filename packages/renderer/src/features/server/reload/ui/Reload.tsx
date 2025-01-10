import { IconReload } from "@tabler/icons-react";

import { ActionIcon } from "@shared/ui/ActionIcon";
import { Tooltip } from "@shared/ui/Tooltip";

import { useReloadServer } from "../api/useReloadServer";

export const ReloadServer = () => {
  const reloadServer = useReloadServer();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    reloadServer.mutate();
  };

  return (
    <form onSubmit={handleSubmit} name={`Reload server`}>
      <Tooltip label="Reload server">
        <ActionIcon type="submit" variant="light" size="lg">
          <IconReload style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
      </Tooltip>
    </form>
  );
};
