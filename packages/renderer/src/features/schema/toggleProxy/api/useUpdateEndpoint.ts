import type { ChannelMap } from "@apish/common";
import { invoke } from "@apish/preload";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export interface Props {
  endpoint: { path: string; method: string };
}

export const useUpdateEndpoint = ({ endpoint }: Props) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: (data: ChannelMap["updateEndpoint"]["request"]) =>
      invoke("updateEndpoint", data),
    onSuccess: (res) => {
      const error = getQueryError("updateEndpoint", res);

      if (error) {
        notifications.show({
          color: "red",
          message: error,
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["endpoint", "proxy", endpoint.path, endpoint.method],
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

  const data = getQueryData("updateEndpoint", mutationResult.data);

  const error = getQueryError("updateEndpoint", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
