import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { metrics, Span, SpanStatusCode, trace } from "@opentelemetry/api";
import { experimental_standaloneMiddleware } from "@trpc/server";
import { flatten } from "flat";
import { stringify } from "safe-stable-stringify";

type MonitoringOptions = {
  serviceName: string;
  collectInput?: boolean;
  collectResult?: boolean;
};

type RequestMetricsArguments = {
  serviceName: string;
  method: string;
  url: string;
  status: number;
  duration: number;
};

function sendRequestMetrics(args: RequestMetricsArguments) {
  const { serviceName, method, url, status, duration } = args;
  const meter = metrics.getMeter(serviceName);

  const requestCounter = meter.createCounter("http_requests_total", {
    description: "Total number of HTTP requests",
    unit: "{requests}",
  });
  const requestDuration = meter.createHistogram("http_requests_duration", {
    description: "Duration of HTTP requests in seconds",
  });

  const requestStatus = meter.createGauge("http_requests_status", {
    description: "HTTP request status codes",
  });
  const requestMethod = meter.createCounter("http_requests_method", {
    description: "HTTP request methods",
  });
  const requestUrl = meter.createCounter("http_requests_url", {
    description: "HTTP request URLs",
  });

  requestCounter.add(1, { method, url, status });
  requestDuration.record(duration / 1000, { method, url, status });
  requestStatus.record(status, { method, url });
  requestMethod.add(1, { method });
  requestUrl.add(1, { url });
}

export function middlewareRequestTracker(options: MonitoringOptions) {
  const { collectInput = true, collectResult = true } = options;
  return experimental_standaloneMiddleware().create(async (opts) => {
    if (process.env.NODE_ENV === "development" || process.env.CI) {
      return opts.next();
    }
    const tracer = trace.getTracer(options.serviceName);
    return tracer.startActiveSpan(`${opts.path} (TRPC ${opts.type})`, async (span: Span) => {
      const startTime = Date.now();
      const result = await opts.next();
      const endTime = Date.now();

      const duration = endTime - startTime;
      sendRequestMetrics({
        serviceName: options.serviceName,
        method: opts.type,
        url: opts.path,
        status: result.ok ? 200 : 500,
        duration: duration,
      });

      if (collectInput && typeof opts.rawInput === "object") {
        span.setAttributes(flatten({ input: opts.rawInput }));
      }
      const meta = { path: opts.path, type: opts.type, ok: result.ok };
      span.setAttributes(meta);
      span.setAttribute("user.email", (opts.ctx as { user: KindeUser<any> }).user?.email || "non-user");

      if (collectResult) {
        span.setAttribute("ok", result.ok);
        if (result.ok) {
          span.setStatus({ code: SpanStatusCode.OK });
          if (typeof result.data === "object") {
            span.setAttributes(flatten({ result: result.data }));
          } else {
            span.setAttribute("result", stringify(result.data || {}));
          }
        } else {
          span.setAttribute("error", stringify(result.error));
          span.recordException(result.error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: result.error.message,
          });
        }
      }
      span.end();
      return result;
    });
  });
}
