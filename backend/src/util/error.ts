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

class MissingData {
  message: string;
  status: number;
  constructor(message: string) {
    this.message = message;
    this.status = 422;
  }
}

export { NotFoundError, NotAuthError, MissingData };