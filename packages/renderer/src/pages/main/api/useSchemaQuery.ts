import type { ChannelMap } from "@apish/common";
import { invoke } from "@apish/preload";
import { useQuery } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

type Props = ChannelMap["getSchema"]["request"];

export const useSchemaQuery = (props: Props) => {
  const queryResult = useQuery({
    queryKey: ["schema", props.id],
    queryFn: () => invoke("getSchema", props),
    enabled: !!props.id,
  });

  const data = getQueryData("getSchema", queryResult.data);

  const error = getQueryError("getSchema", queryResult.data);

  return { ...queryResult, data, error, isError: !!error };
};
