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

export interface IConfig {
  id: number
  current_schema_id: null | number
}

export interface ChannelMap {
  schemaUpload: {
    request: {
      file: ArrayBuffer
      name: string
    }
    response: ISchema
  }
  getSchemaList: {
    request: undefined
    response: ISchema[]
  }
  getSchema: {
    request: {
      id: number
    }
    response: ISchema
  }
  getConfig: {
    request: undefined
    response: IConfig
  }
  updateConfig: {
    request: Partial<Omit<IConfig, 'id'>>
    response: IConfig
  }
}
