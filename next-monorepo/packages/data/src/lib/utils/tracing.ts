import { Attributes, Span, SpanStatusCode, trace } from "@opentelemetry/api";
import { stringify } from "safe-stable-stringify";
import { PgDatabase } from "drizzle-orm/pg-core";

type TraceOptions = {
  collectInput?: boolean;
  collectResult?: boolean;
  collectError?: boolean;
};

export function traceAsyncMethod<T extends (...args: any[]) => Promise<any>>(fn: T, objectName?: string, methodName?: string, options?: TraceOptions): T {
  const wrapped = async function (...args: Parameters<T>): Promise<ReturnType<T>> {
    if (process.env.NODE_ENV === "test" || process.env.CI) {
      // Skip tracing in test or CI environments
      return fn(...args);
    }
    
    const fnName = fn.name || "anonymous function";
    const { collectInput = true, collectResult = true, collectError } = options || {};
    let result;

    const spanName = `${objectName ? objectName + "." : ""}${methodName || fnName}`;
    let attributes: Attributes = {
      "code.function": spanName,
      ...(objectName ? { "code.object": objectName } : {}),
    };

    const tracer = trace.getTracer(process.env.APP_NAME || "members");

    return tracer.startActiveSpan(spanName, { attributes }, async (span: Span) => {
      try {
        result = await fn(...args);
        span.setStatus({ code: SpanStatusCode.OK });
        if (collectInput) {
          span.setAttribute(
            "code.input",
            stringify(args, (key, value) => {
              if (value instanceof PgDatabase) {
                return "PgDatabase";
              }
              return value;
            }) || ""
          );
        }
        if (collectResult) {
          span.setAttribute("code.result", stringify(result) || "");
        }
        return result;
      } catch (err: any) {
        if (collectError) {
          console.error(`Error in function ${fnName}:`, err);
        }
        span.recordException(err);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err instanceof Error ? err.message : String(err),
        });
        throw err;
      } finally {
        const endTime = Date.now();
        span.end();
      }
    });
  } as T;

  return wrapped;
}

export function applyTracing<T extends Record<string, any>>(
  module: T,
  tracePrefix = "moduleName",
  traceOptions: TraceOptions = { collectInput: true, collectResult: true }
): T {
  const tracedFunctions = {} as T;

  for (const key in module) {
    const value = module[key];

    if (typeof value === "function" && value.constructor.name === "AsyncFunction") {
      tracedFunctions[key] = traceAsyncMethod(value, tracePrefix, key, traceOptions);
    } else {
      tracedFunctions[key] = value;
    }
  }

  return tracedFunctions;
}
