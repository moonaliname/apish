import type { ChannelMap } from "@apish/common";
import { send } from "@apish/preload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export interface Props {
  response: { path: string; method: string; code: number };
}

export const useUpdateResponse = ({ response }: Props) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: (data: ChannelMap["updateResponse"]["request"]) => {
      return send("updateResponse", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["response", response.path, response.method, response.code],
      });
    },
  });

  const data = getQueryData("updateResponse", mutationResult.data);

  const error = getQueryError("updateResponse", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
