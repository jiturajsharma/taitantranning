class ApiError extends Error {

    constructor(
    statusCode,
    message = "Internal Server Error",
    errors = [],
    data = null
    ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.data = data;

    // Capture stack trace (cleaner stack, excludes constructor call)
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
}

toJSON() {
    return {
        success: this.success,
        statusCode: this.statusCode,
        message: this.message,
        errors: this.errors,
        data: this.data,
        };
    }
}

export { ApiError };