type BaseErrorOption = {
  status: number;
  isNetworkError?: boolean;
  message: string;
};

export class ResponseError extends Error {
  isNetworkError: boolean;
  status: number;
  constructor(options: BaseErrorOption) {
    super(options.message);
    this.status = options.status;
    this.isNetworkError = options.isNetworkError ?? false;
  }
}
