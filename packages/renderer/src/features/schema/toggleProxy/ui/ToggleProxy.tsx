import { Checkbox } from "@shared/ui/Checkbox";
import { Tooltip } from "@shared/ui/Tooltip";

import { useGetEndpoint } from "../api/useEndpointQuery";
import { useUpdateEndpoint } from "../api/useUpdateEndpoint";

interface Props {
  path: string;
  method: string;
}

export const ToggleProxy = (props: Props) => {
  const endpointQuery = useGetEndpoint(props);
  const updateEndpoint = useUpdateEndpoint({ endpoint: props });

  return (
    <Tooltip label="Toggle proxy">
      <Checkbox
        checked={Boolean(endpointQuery.data?.is_enabled_proxy)}
        onChange={(e) => {
          updateEndpoint.mutate({
            ...props,
            is_enabled_proxy: e.target.checked,
          });
        }}
      />
    </Tooltip>
  );
};
