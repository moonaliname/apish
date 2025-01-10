import type { ChannelMap } from "@apish/common";
import { invoke } from "@apish/preload";
import { useQuery } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

type Props = ChannelMap["getResponse"]["request"];

export const useResponseQuery = (props: Props) => {
  const queryResult = useQuery({
    queryKey: ["response", props.path, props.method, props.code],
    queryFn: () => invoke("getResponse", props),
  });

  const data = getQueryData("getResponse", queryResult.data);

  const error = getQueryError("getResponse", queryResult.data);

  return { ...queryResult, data, error, isError: !!error };
};
