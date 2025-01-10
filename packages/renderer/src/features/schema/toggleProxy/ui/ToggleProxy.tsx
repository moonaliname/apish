import { Checkbox } from "@shared/ui/Checkbox";
import { Tooltip } from "@shared/ui/Tooltip";

import { useGetEndpoint } from "../api/useGetEndpoint";
import { useAction } from "../model/action";

interface Props {
  path: string;
  method: string;
}

export const ToggleProxy = (props: Props) => {
  const endpointQuery = useGetEndpoint(props);
  const action = useAction({ endpoint: props });

  return (
    <Tooltip label="Toggle proxy">
      <Checkbox
        checked={Boolean(endpointQuery.data?.is_enabled_proxy)}
        onChange={(e) => {
          action.mutate({ ...props, is_enabled_proxy: e.target.checked });
        }}
      />
    </Tooltip>
  );
};
