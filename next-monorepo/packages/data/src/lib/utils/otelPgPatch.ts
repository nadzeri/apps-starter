import { SpanStatusCode, trace } from "@opentelemetry/api";
import { flatten } from "flat";
import type { Client, Pool } from "pg";
import { stringify } from "safe-stable-stringify";

const PATCHED_SYMBOL = Symbol.for("pg-client");

function rowsToObjectMap(rows: any[], fields: { name: string }[]): Record<string, any>[] {
  return rows.map((row) => {
    const obj: Record<string, any> = {};
    fields.forEach((field, index) => {
      obj[field.name] = row[index];
    });
    return obj;
  });
}

export function patchPgClient(client: Client | Pool): Client | Pool {
  if ((client as any)[PATCHED_SYMBOL] || process.env.CI || process.env.NODE_ENV === "development") {
    return client; // Already patched
  }

  const tracer = trace.getTracer(process.env.APP_NAME || "app_name");

  const originalQuery = client.query;

  client.query = function patchedQuery(...args: any[]) {
    return tracer.startActiveSpan("pg.query", (span) => {
      span.setAttributes(flatten({ args }));

      /* @ts-ignore */
      const result = originalQuery.apply(client, args);
      /* @ts-ignore */
      if (result?.then) {
        return (
          result
            /* @ts-ignore */
            .then((res: any) => {
              if (res.rows) {
                const parsedRows = rowsToObjectMap(res.rows, res.fields);
                parsedRows.forEach((row, index) => {
                  span.setAttribute(`db.result.row.${index}`, stringify(row))
                })
              }
              span.end();
              return res;
            })
            .catch((err: any) => {
              span.recordException(err);
              span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
              span.end();
              throw err;
            })
        );
      } else {
        span.end();
        return result;
      }
    });
  };

  (client as any)[PATCHED_SYMBOL] = true;
  return client;
}
