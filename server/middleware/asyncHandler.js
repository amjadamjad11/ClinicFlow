// Async handler wrapper.
// Why? → Express does not automatically forward rejected promises from
// async route handlers to the error middleware in every setup.
// This wrapper forwards async errors to the centralized error handler.

const asyncHandler = (controllerFunction) => {
    return (req, res, next) => {
        Promise.resolve(controllerFunction(req, res, next))
            .catch(next);
    };
};

module.exports = asyncHandler;