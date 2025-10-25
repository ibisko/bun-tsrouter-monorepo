import z from "zod"

type Step = "middleware" | "validation" | 'service'

type BaseErrorOption = {
  step: Step
  message: string,
  status: number
}

class BaseError extends Error {
  step: Step
  status: number
  constructor(options: BaseErrorOption) {
    super(options.message)
    this.status = options.status
    this.step = options.step
  }
}

type MiddlewareErrorOptions = {
  method: string
  status: number
  message: string
  reason?: string
  data?: Record<string, unknown>
}
/** 中间件错误 */
export class MiddlewareError extends BaseError {
  method: string
  reason?: unknown
  data?: Record<string, unknown>
  constructor(options: MiddlewareErrorOptions) {
    super({
      step: "middleware",
      message: options.message,
      status: options.status
    })
    this.method = options.method
    this.reason = options.reason
    this.data = options.data
  }
  format() {
    return {
      step: this.step,
      message: this.message,
      status: this.status,
      reason: this.reason,
      data: this.data,
    }
  }
}

/** 参数校验错误 */
export class ValidationError extends BaseError {
  constructor(error: z.ZodError) {
    super({
      step: "validation",
      status: 400,
      message: z.prettifyError(error),
    });
  }
  format() {
    return {
      step: this.step,
      message: this.message,
    }
  }
}

type ServiceErrorOptions = {
  message: string,
  reason?: unknown,
  data?: Record<string, unknown>
  isAccident?: boolean
}
/** service 错误 */
export class ServiceError extends BaseError {
  reason?: unknown
  data?: Record<string, unknown>
  /** 是否为意外异常 */
  isAccident?: boolean
  constructor(options: ServiceErrorOptions) {
    super({
      step: "service",
      status: 400,
      message: options.message,
    });
    this.reason = options.reason
    this.data = options.data
    this.isAccident = options.isAccident
  }
  format() {
    return {
      step: this.step,
      message: this.message,
      reason: this.reason,
      data: this.data,
      isAccident: this.isAccident,
    }
  }
}
