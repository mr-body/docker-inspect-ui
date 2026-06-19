export {}

declare global {
  interface Window {
    __ENV__?: {
      HTTP_SERVER: string
      WS_SERVER: string
    }
  }
}