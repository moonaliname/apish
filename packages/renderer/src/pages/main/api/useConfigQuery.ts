import { send } from "@apish/preload";
import { useQuery } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export const useConfigQuery = () => {
  const queryResult = useQuery({
    queryKey: ["config"],
    queryFn: () => send("getConfig"),
  });

  const data = getQueryData("getConfig", queryResult.data);

  const error = getQueryError("getConfig", queryResult.data);

  return { ...queryResult, data, error, isError: !!error };
};
