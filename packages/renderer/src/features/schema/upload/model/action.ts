import type { ISchema, ISchemaUploadRequest } from "@apish/common";
import { send } from "@apish/preload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface Props {
  onSuccess: (data: ISchema) => void;
}

export const useAction = ({ onSuccess }: Props) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ISchemaUploadRequest) => send("schemaUpload", data),
    onSuccess: (res) => {
      if ("data" in res) {
        onSuccess(res.data);
        queryClient.invalidateQueries({ queryKey: ["schemas"] });
      }
    },
  });
};
