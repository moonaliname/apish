import type { ChannelMap } from "@apish/common";
import { send } from "@apish/preload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export interface Props {
  endpoint: { path: string; method: string };
}

export const useAction = ({ endpoint }: Props) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: (data: ChannelMap["updateEndpoint"]["request"]) =>
      send("updateEndpoint", data),
    onSuccess: (res) => {
      if ("data" in res) {
        queryClient.invalidateQueries({
          queryKey: ["endpoint", endpoint.path, endpoint.method],
        });
      }
    },
  });

  const data = getQueryData("updateEndpoint", mutationResult.data);

  const error = getQueryError("updateEndpoint", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
