import type { ChannelMap } from "@apish/common";
import { send } from "@apish/preload";
import { notifications } from "@mantine/notifications";
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
      const error = getQueryError("deleteSchema", res);

      if (error) {
        notifications.show({
          color: "red",
          message: error,
        });
      } else {
        onSuccess();
        queryClient.invalidateQueries({ queryKey: ["schemas"] });
        queryClient.invalidateQueries({ queryKey: ["config"] });
      }
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: "Something wrong happend",
      });
    },
  });

  const data = getQueryData("deleteSchema", mutationResult.data);

  const error = getQueryError("deleteSchema", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
