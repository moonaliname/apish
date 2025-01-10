import { send } from "@apish/preload";
import { useQuery } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export const useSchemasQuery = () => {
  const queryResult = useQuery({
    queryKey: ["schemas"],
    queryFn: () => send("getSchemaList"),
  });

  const data = getQueryData("getSchemaList", queryResult.data);

  const error = getQueryError("getSchemaList", queryResult.data);

  return { ...queryResult, data, error, isError: !!error };
};
