import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
    let error = err;

    // Agar error hamari custom ApiError class ka nahi hai, toh use convert karein
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(error.statusCode).json(response);
};

export { errorMiddleware };