export interface IPayloadUserJWT {
  userID: number;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
  userID: number;
}

export interface IForgotPassword {
  email: string;
}
