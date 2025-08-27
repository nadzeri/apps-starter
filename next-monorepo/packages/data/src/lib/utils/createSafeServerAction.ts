import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { ServerActionError, ServerActionResponse } from "../../types";
import { awesomeappErrorsResolver } from "../errors";

export function createSafeServerAction<T>(target: (...args: any[]) => Promise<T>): (...args: any[]) => ServerActionResponse<T> {
  return async (...args: any[]) => {
    try {
      const data = await target(...args);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      if (error instanceof TRPCClientError && error.cause instanceof TRPCError) {
        const formattedError: ServerActionError = {
          code: error.cause.code,
          name: error.message,
          message: awesomeappErrorsResolver(error.message),
        };

        return {
          success: false,
          error: formattedError,
        };
      }

      throw error;
    }
  };
}
