import type { ChannelMap } from "@apish/common";
import { send } from "@apish/preload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export interface Props {
  onSuccess: () => void;
}

export const useAction = ({ onSuccess }: Props) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: (data: ChannelMap["deleteSchema"]["request"]) =>
      send("deleteSchema", data),
    onSuccess: (res) => {
      if ("data" in res) {
        onSuccess();
        queryClient.invalidateQueries({ queryKey: ["schemas"] });
        queryClient.invalidateQueries({ queryKey: ["config"] });
      }
    },
  });

  const data = getQueryData("deleteSchema", mutationResult.data);

  const error = getQueryError("deleteSchema", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
