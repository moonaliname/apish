export interface IErrorOperationResult {
  success: false
  data: undefined
  error: string
}

export const errorOperationResult = (error: string): IErrorOperationResult => {
  return { success: false, data: undefined, error }
}

export interface ISuccessOperationResult<T> {
  success: true
  data: T
  error?: string
}

export const successOperationResult = <T>(
  data: T,
  error?: string,
): ISuccessOperationResult<T> => {
  return {
    success: true,
    data,
    error,
  }
}
