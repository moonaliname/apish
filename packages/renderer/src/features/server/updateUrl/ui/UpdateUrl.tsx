import { useConfigQuery, useUpdateConfig } from "@entities/config";

import { Input } from "@shared/ui/Input";

export const UpdateUrl = () => {
  const configQuery = useConfigQuery();
  const updateEndpoint = useUpdateConfig();

  return (
    <Input
      placeholder="API url"
      defaultValue={configQuery.data?.target_url ?? ""}
      onChange={(e) => {
        updateEndpoint.mutate({ target_url: e.target.value });
      }}
    />
  );
};
