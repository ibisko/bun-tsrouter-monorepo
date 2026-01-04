type MiddlewareErrorOptions = {
  func: string;
  message: string;
  status: number;
  reason?: string;
  data?: Record<string, unknown>;
};
/** 中间件错误 */
export class MiddlewareError extends Error {
  status: number;
  func: string;
  reason?: string;
  data?: Record<string, unknown>;
  constructor(options: MiddlewareErrorOptions) {
    super(options.message);
    this.status = options.status;
    this.func = options.func;
    this.reason = options.reason;
    this.data = options.data;
  }
}

/** 参数校验错误 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type ServiceErrorOptions = {
  message: string;
  reason?: string;
  status?: number;
  data?: Record<string, unknown>;
};
/** service 错误 */
export class ServiceError extends Error {
  status: number;
  reason?: string;
  data?: Record<string, unknown>;
  constructor(options: ServiceErrorOptions) {
    super(options.message);
    this.status = options.status ?? 400;
    this.reason = options.reason;
    this.data = options.data;
  }
}
