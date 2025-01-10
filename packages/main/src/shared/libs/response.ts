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
  let stringError = ''
  if (error === 'string') {
    stringError = error
  } else if (error instanceof Error) {
    stringError = error.message
  } else {
    stringError = JSON.stringify(error)
  }

  return {
    error: stringError,
    code,
  }
}
