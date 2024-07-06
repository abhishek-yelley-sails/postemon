class NotFoundError {
  message: string;
  status: number;
  constructor(message: string) {
    this.message = message;
    this.status = 404;
  }
}

class NotAuthError {
  message: string;
  status: number;
  constructor(message: string) {
    this.message = message;
    this.status = 401;
  }
}

export { NotFoundError, NotAuthError };