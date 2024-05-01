import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  status_code: number;
  status: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  status_code: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract status_code: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status_code: this.status_code,
      status: this.status
    };
  }
}

export class BadRequestError extends CustomError {
  status_code: number = HTTP_STATUS.BAD_REQUEST;
  status: string = 'BAD REQUEST';

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  status_code: number = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status: string = 'BAD REQUEST';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  status_code: number = HTTP_STATUS.NOT_FOUND;
  status: string = 'BAD REQUEST';

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends CustomError {
  status_code: number = HTTP_STATUS.UNAUTHORIZED;
  status: string = 'BAD REQUEST';

  constructor(message: string) {
    super(message);
  }
}

export class RequestValidationError extends CustomError {
  status_code: number = HTTP_STATUS.BAD_REQUEST;
  status: string = 'BAD REQUEST';

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  status_code: number = HTTP_STATUS.REQUEST_TOO_LONG;
  status: string = 'BAD REQUEST';

  constructor(message: string) {
    super(message);
  }
}
