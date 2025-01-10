import type { ChannelMap, ISchema } from "@apish/common";
import { send } from "@apish/preload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export interface Props {
  onSuccess: (data: ISchema) => void;
}

export const useAction = ({ onSuccess }: Props) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: (data: ChannelMap["schemaUpload"]["request"]) =>
      send("schemaUpload", data),
    onSuccess: (res) => {
      if ("data" in res) {
        onSuccess(res.data);
        queryClient.invalidateQueries({ queryKey: ["schemas"] });
      }
    },
  });

  const data = getQueryData("schemaUpload", mutationResult.data);

  const error = getQueryError("schemaUpload", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
