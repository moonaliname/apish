import { invoke } from "@apish/preload";
import { useQuery } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

interface Props {
  method: string;
  path: string;
}

export const useGetEndpoint = (props: Props) => {
  const queryResult = useQuery({
    queryKey: ["endpoint", "enabled_code", props.path, props.method],
    queryFn: () => invoke("getEndpoint", props),
  });

  const data = getQueryData("getEndpoint", queryResult.data);

  const error = getQueryError("getEndpoint", queryResult.data);

  return { ...queryResult, data, error, isError: !!error };
};
