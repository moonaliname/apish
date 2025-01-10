import type {
  ChannelMap,
  IErrorResponse,
  ISuccessResponse,
} from "@apish/common";

export const getQueryError = <K extends keyof ChannelMap>(
  channel: K,
  response?: ISuccessResponse<ChannelMap[K]["response"]> | IErrorResponse,
) => {
  return !!response && "error" in response ? response.error : undefined;
};
