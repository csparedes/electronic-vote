export interface UserSession {
  id: number
  email: string
  name: string
  role: string
  identification: string
}

declare module '#auth-utils' {
  interface User {
    id: number
    email: string
    name: string
    role: string
    identification: string
  }
}
