import type {
  ChannelMap,
  IErrorResponse,
  ISuccessResponse,
} from "@apish/common";

export const getQueryData = <K extends keyof ChannelMap>(
  _channel: K,
  response?: ISuccessResponse<ChannelMap[K]["response"]> | IErrorResponse,
) => {
  return !!response && "data" in response ? response.data : undefined;
};
