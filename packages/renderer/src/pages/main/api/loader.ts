import { send } from "@apish/preload";
import { useQuery } from "@tanstack/react-query";

export const useLoader = () => {
  return useQuery({
    queryKey: ["schemas"],
    queryFn: () => send("getSchemaList"),
  });
};
