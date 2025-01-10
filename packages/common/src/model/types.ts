type AutomatedFields = 'id' | 'created_at' | 'updated_at'

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

export interface IEndpoint {
  id: number
  path: string
  method: string
  is_enabled_proxy: boolean
  enabled_code: string
  created_at: Date
  updated_at: Date
  schema_id: null | number
}

export interface IResponse {
  id: number
  path: string
  method: string
  code: string
  template: string
  created_at: Date
  updated_at: Date
  schema_id: null | number
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
  deleteSchema: {
    request: {
      id: number
    }
    response: string
  }
  getConfig: {
    request: undefined
    response: IConfig
  }
  updateConfig: {
    request: Partial<Omit<IConfig, AutomatedFields>>
    response: IConfig
  }
  getEndpoint: {
    request: Pick<IEndpoint, 'path' | 'method'>
    response: IEndpoint
  }
  updateEndpoint: {
    request: Pick<IEndpoint, 'path' | 'method'> &
      Partial<Omit<IEndpoint, AutomatedFields | 'path' | 'method'>>
    response: IEndpoint
  }
  getResponse: {
    request: Pick<IResponse, 'path' | 'method' | 'code'>
    response: IResponse
  }
  updateResponse: {
    request: Pick<IResponse, 'path' | 'method' | 'code'> &
      Partial<Omit<IResponse, AutomatedFields | 'path' | 'method' | 'code'>>
    response: IResponse
  }
}
