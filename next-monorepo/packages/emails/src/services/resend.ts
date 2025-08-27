import { Resend } from "resend";

export const createResend = () => {
  return new Resend(process.env.RESEND_API_KEY);
};
