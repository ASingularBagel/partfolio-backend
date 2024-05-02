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
  errors?: { message: string; field: string | undefined }[];
}

export abstract class CustomError extends Error {
  abstract status_code: number;
  abstract status: string;
  abstract errors?: { message: string; field: string | undefined }[];

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status_code: this.status_code,
      status: this.status,
      errors: this.errors
    };
  }
}

export class BadRequestError extends CustomError {
  status_code: number = HTTP_STATUS.BAD_REQUEST;
  status: string = 'BAD REQUEST';
  errors?: { message: string; field: string | undefined }[] | undefined;

  constructor(message: string, errors: { message: string; field: string | undefined }[]) {
    super(message);
    this.errors = errors;
  }
}

export class ServerError extends CustomError {
  status_code: number = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status: string = 'BAD REQUEST';
  errors?: { message: string; field: string | undefined }[] | undefined;

  constructor(message: string, errors: { message: string; field: string | undefined }[]) {
    super(message);
    this.errors = errors;
  }
}

export class NotFoundError extends CustomError {
  status_code: number = HTTP_STATUS.NOT_FOUND;
  status: string = 'BAD REQUEST';
  errors?: { message: string; field: string | undefined }[] | undefined;

  constructor(message: string, errors: { message: string; field: string | undefined }[]) {
    super(message);
    this.errors = errors;
  }
}

export class UnauthorizedError extends CustomError {
  status_code: number = HTTP_STATUS.UNAUTHORIZED;
  status: string = 'BAD REQUEST';
  errors?: { message: string; field: string | undefined }[] | undefined;

  constructor(message: string, errors: { message: string; field: string | undefined }[]) {
    super(message);
    this.errors = errors;
  }
}

export class RequestValidationError extends CustomError {
  status_code: number = HTTP_STATUS.BAD_REQUEST;
  status: string = 'BAD REQUEST';
  errors?: { message: string; field: string | undefined }[] | undefined;

  constructor(message: string, errors: { message: string; field: string | undefined }[]) {
    super(message);
    this.errors = errors;
  }
}

export class FileTooLargeError extends CustomError {
  status_code: number = HTTP_STATUS.REQUEST_TOO_LONG;
  status: string = 'BAD REQUEST';
  errors?: { message: string; field: string | undefined }[] | undefined;

  constructor(message: string, errors: { message: string; field: string | undefined }[]) {
    super(message);
    this.errors = errors;
  }
}

export class JoiRequestValidationError extends CustomError {
  status_code: number = HTTP_STATUS.BAD_REQUEST;
  status: string = 'FAILED VERIFICATION';
  errors?: { message: string; field: string | undefined }[] | undefined;

  constructor(message: string, validationErrors: { field: string | undefined; message: string }[]) {
    super(message);
    this.errors = validationErrors;
  }
}
