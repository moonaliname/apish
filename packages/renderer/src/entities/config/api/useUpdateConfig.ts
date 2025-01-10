import type { ChannelMap } from "@apish/common";
import { send } from "@apish/preload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export const useUpdateConfig = () => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: (data: ChannelMap["updateConfig"]["request"]) => {
      return send("updateConfig", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });

  const data = getQueryData("updateConfig", mutationResult.data);

  const error = getQueryError("updateConfig", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
