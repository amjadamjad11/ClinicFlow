// Centralized Express error handler.
// Why? → Keeps API errors consistent across ClinicFlow instead of
// repeating error-response logic inside every controller.

const errorMiddleware = (err, req, res, next) => {
    // Log the actual error on the server for debugging.
    // The client should not receive unnecessary internal details.
    console.error("ClinicFlow Error:", err.message);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    // Track whether this is an expected error that is safe
    // to explain to the API client.
    let isKnownError = statusCode !== 500;

    // Request body exceeded the 10 KB limit configured in server.js.
    // 413 means "Payload Too Large".
    // Why? → The client sent more data than our API accepts.
    if (err.type === "entity.too.large") {
        statusCode = 413;
        isKnownError = true;

    // Use a clean API message instead of exposing
    // the internal body-parser error message.
        message = "Request body too large";
    }

    // Invalid JSON sent by the client.
    // Example: { name: Amjad } is invalid JSON because "Amjad"
    // must be inside double quotes.
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        Object.prototype.hasOwnProperty.call(err, "body")
    ) {
        statusCode = 400;
        isKnownError = true;

        message = "Invalid JSON payload";
    }

    // Mongoose validation error.
    // Example: missing required field or invalid enum value.
    if (err.name === "ValidationError") {
        statusCode = 400;
        isKnownError = true;

        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }

    // Invalid MongoDB ObjectId.
    // Example: GET /api/doctors/invalid-id
    if (err.name === "CastError") {
        statusCode = 400;
        isKnownError = true;

        message = `Invalid ${err.path}: ${err.value}`;
    }

    // MongoDB duplicate-key error.
    // Example: duplicate doctor licenseNumber.
    if (err.code === 11000) {
        statusCode = 409;
        isKnownError = true;

        const duplicateField = Object.keys(err.keyValue || {})[0];

        message = duplicateField
            ? `${duplicateField} already exists`
            : "Duplicate value already exists";
    }

    // Unexpected errors should not expose internal details
    // when the application is running in production.
    if (!isKnownError && process.env.NODE_ENV === "production") {
        message = "Internal server error";
    }

    res.status(statusCode).json({
        status: "error",
        message,
    });
};

module.exports = errorMiddleware;