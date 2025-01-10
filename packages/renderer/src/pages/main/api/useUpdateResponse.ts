import type { ChannelMap } from "@apish/common";
import { send } from "@apish/preload";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export interface Props {
  response: { path: string; method: string; code: string };
}

export const useUpdateResponse = ({ response }: Props) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: (data: ChannelMap["updateResponse"]["request"]) => {
      return send("updateResponse", data);
    },
    onSuccess: (res) => {
      const error = getQueryError("updateResponse", res);

      if (error) {
        notifications.show({
          color: "red",
          message: error,
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["response", response.path, response.method, response.code],
        });
      }
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: "Something wrong happend",
      });
    },
  });

  const data = getQueryData("updateResponse", mutationResult.data);

  const error = getQueryError("updateResponse", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
