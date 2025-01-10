import { Radio } from "@shared/ui/Radio";

import {
  type Props as EnableCodeProps,
  useEnableCode,
} from "../api/useEnableCode";
import { useGetEndpoint } from "../api/useEndpointQuery";

interface Props extends EnableCodeProps {
  name: string;
  code: string;
}

export const EnableCode = ({ endpoint, name, code }: Props) => {
  const endpointQuery = useGetEndpoint({
    path: endpoint.path,
    method: endpoint.method,
  });
  const updateEndpoint = useEnableCode({
    endpoint: {
      path: endpoint.path,
      method: endpoint.method,
    },
  });

  return (
    <Radio
      label={code}
      name={name}
      value={code}
      onChange={(e) => {
        if (e.target.checked) {
          updateEndpoint.mutate({
            path: endpoint.path,
            method: endpoint.method,
            enabled_code: code,
          });
        }
      }}
      checked={Boolean(endpointQuery.data?.enabled_code === code)}
    />
  );
};
