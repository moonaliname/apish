export interface IPingRequest {
  id: number
}

export interface IPingResponse {
  id: number
  success: boolean
}

export interface ChannelMap {
  ping: {
    request: IPingRequest
    response: IPingResponse
  }
}
