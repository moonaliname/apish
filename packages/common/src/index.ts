export interface ISuccessResponse<T> {
  code: number
  data: T
}

export interface IErrorResponse {
  code: number
  error: string
}

export interface ISchema {
  id: number
  name: string
  doc: string
  paths: string
  created_at: Date
  updated_at: Date
}

export interface ISchemaUploadRequest {
  file: ArrayBuffer
  name: string
}

export interface ChannelMap {
  schemaUpload: {
    request: ISchemaUploadRequest
    response: ISuccessResponse<ISchema> | IErrorResponse
  }
  getSchemaList: {
    request: undefined
    response: ISuccessResponse<ISchema[]> | IErrorResponse
  }
}
