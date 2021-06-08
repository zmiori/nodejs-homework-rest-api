const guard = require("../helpers/guard");
const passport = require("passport");
const { HttpCode } = require("../helpers/constants");

describe("unit test guard", () => {
  const user = { token: "111111" };
  const req = { get: jest.fn((header) => `Bearer ${user.token}`), user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();

  it("run guard with no token", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => cb(null, false)
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  });
  it("run guard with invalid token", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) =>
        cb(null, { token: "2222222" })
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  it("run guard with valid token", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => cb(null, user)
    );
    guard(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
