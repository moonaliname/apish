export const IPC_PING_PATH = 'schema'

export interface IPingRequest {
  id: number
}

export interface IPingResponse {
  id: number
  success: boolean
}
