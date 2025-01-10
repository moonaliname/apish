import { Button } from "@shared/ui/Button";

import { useReloadServer } from "../api/useReloadServer";

export const ReloadServer = () => {
  const reloadServer = useReloadServer();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    reloadServer.mutate();
  };

  return (
    <form onSubmit={handleSubmit} name={`Reload server`}>
      <Button type="submit" variant="outline">
        Reload server
      </Button>
    </form>
  );
};
