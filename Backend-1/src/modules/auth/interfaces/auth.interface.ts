export interface OTPAttributes {
  id: number;
  userId: number;
  otp: string;
  sendTime: Date;
  type: string;
  isExpired: boolean;
}
