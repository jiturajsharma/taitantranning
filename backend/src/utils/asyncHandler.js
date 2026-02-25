const asyncHandler = (handler) => {
    if (typeof handler !== "function") {
    throw new TypeError("Route handler must be a function");
    }

    return (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);
};

export { asyncHandler };