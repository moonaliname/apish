import { send } from "@apish/preload";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { getQueryData } from "@shared/libs/getQueryData";
import { getQueryError } from "@shared/libs/getQueryError";

export const useReloadServer = () => {
  const mutationResult = useMutation({
    mutationFn: () => {
      return send("reloadServer");
    },
    onSuccess: (res) => {
      const error = getQueryError("reloadServer", res);

      if (error) {
        notifications.show({
          color: "red",
          message: error,
        });
      } else {
        notifications.show({
          title: "Default notification",
          message: "Server was successfully reloaded",
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

  const data = getQueryData("reloadServer", mutationResult.data);

  const error = getQueryError("reloadServer", mutationResult.data);

  return { ...mutationResult, data, error, isError: !!error };
};
