import type { ChannelMap } from "@apish/common";
import { send } from "@apish/preload";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export const useUpdateConfig = () => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: (data: ChannelMap["updateConfig"]["request"]) => {
      return send("updateConfig", data);
    },
    onSuccess: (res) => {
      const error = getQueryError("updateConfig", res);

      if (error) {
        notifications.show({
          color: "red",
          message: error,
        });
      } else {
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

  const data = getQueryData("updateConfig", mutationResult.data);

  const error = getQueryError("updateConfig", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
