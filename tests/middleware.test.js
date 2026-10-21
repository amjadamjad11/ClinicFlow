const { test } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

// Use a test-only secret. Never use a real production secret in tests.
process.env.JWT_SECRET = "clinicflow-automated-test-secret";

const authMiddleware = require("../server/middleware/authMiddleware");
const roleMiddleware = require("../server/middleware/roleMiddleware");

// Create mock request and response objects so tests don't need a real server.
function createMocks(headers = {}, user = undefined) {
    const req = { headers, user };
    const res = {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        },
    };

    let nextCalled = false;

    function next() {
        nextCalled = true;
    }

    return {
        req,
        res,
        next,
        wasNextCalled: () => nextCalled,
    };
}

test("authentication rejects a request without a Bearer token", () => {
    const { req, res, next, wasNextCalled } = createMocks();

    authMiddleware(req, res, next);

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Authentication required");
    assert.equal(wasNextCalled(), false);
});

test("authentication rejects an invalid token", () => {
    const { req, res, next, wasNextCalled } = createMocks({
        authorization: "Bearer invalid-token",
    });

    authMiddleware(req, res, next);

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Invalid or expired token");
    assert.equal(wasNextCalled(), false);
});

test("authentication accepts a valid token", () => {
    const token = jwt.sign(
        { id: "test-user", role: "Admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1m" }
    );

    const { req, res, next, wasNextCalled } = createMocks({
        authorization: `Bearer ${token}`,
    });

    authMiddleware(req, res, next);

    assert.equal(wasNextCalled(), true);
    assert.equal(req.user.role, "Admin");
});

test("role middleware rejects a request without an authenticated user", () => {
    const { req, res, next, wasNextCalled } = createMocks();

    roleMiddleware("Admin")(req, res, next);

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Authentication required");
    assert.equal(wasNextCalled(), false);
});

test("role middleware rejects a user whose role is not allowed", () => {
    const { req, res, next, wasNextCalled } = createMocks(
        {},
        { role: "Doctor" }
    );

    roleMiddleware("Admin", "Receptionist")(req, res, next);

    assert.equal(res.statusCode, 403);
    assert.equal(res.body.message, "Access denied");
    assert.equal(wasNextCalled(), false);
});

test("role middleware allows an authorized Receptionist", () => {
    const { req, res, next, wasNextCalled } = createMocks(
        {},
        { role: "Receptionist" }
    );

    roleMiddleware("Admin", "Receptionist")(req, res, next);

    assert.equal(wasNextCalled(), true);
});
