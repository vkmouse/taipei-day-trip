export enum LoginResponse {
  Success,
  EmailNotExist,
  PasswordError,
  LoginFailed,
  ServerFailed,
}

export type UserInfo = {
  id: number
  name: string
  email: string
}
