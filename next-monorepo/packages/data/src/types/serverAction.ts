export type ServerActionError = {
  code: string;
  name: string;
  message: string;
};
export type ServerActionResponse<T = any> = Promise<
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ServerActionError;
    }
>;
