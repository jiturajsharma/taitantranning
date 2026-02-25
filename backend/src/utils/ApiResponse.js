class ApiResponse {

    constructor(
    statusCode,
    data = null,
    message = "Success",
    meta = null
    ) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = meta;

    // Freeze object to prevent accidental mutation
    Object.freeze(this);
    }


    toJSON() {
    return {
        success: this.success,
        statusCode: this.statusCode,
        message: this.message,
        data: this.data,
        meta: this.meta,
        };
    }

    static success(data, message = "Success", statusCode = 200, meta = null) {
    return new ApiResponse(statusCode, data, message, meta);
    }

    static failure(message = "Failed", statusCode = 400, data = null) {
    return new ApiResponse(statusCode, data, message);
    }
}

export { ApiResponse };