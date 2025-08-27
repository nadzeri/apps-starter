import { appRouter } from "../../../../server/api/root";
import { createTRPCContext } from "../../../../server/api/trpc";
import { FetchCreateContextFnOptions, fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: ({ req: { headers } }: FetchCreateContextFnOptions) => {
      return createTRPCContext({ headers });
    },
  });
};

export { handler as GET, handler as POST };
