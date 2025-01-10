import cn from "clsx";

export const getMethodColor = (method: string) => {
  return cn({
    "bg-blue-500": method === "get",
    "bg-green-500": method === "post",
    "bg-red-500": method === "delete",
    "bg-yellow-500": method === "put",
  });
};
