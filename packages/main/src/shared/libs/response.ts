import type { IErrorResponse, ISuccessResponse } from '@apish/common'

export const successResponse = <T>(
  data: T,
  code: number = 200,
): ISuccessResponse<T> => {
  return { data, code }
}

export const errorResponse = (
  error: unknown,
  code: number = 500,
): IErrorResponse => {
  return { error: JSON.stringify(error, null, 2), code }
}
