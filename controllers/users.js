const jwt = require("jsonwebtoken");
require("dotenv").config();

const Users = require("../model/users");
const { HttpCode } = require("../helpers/constants");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const register = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email);
    if (user) {
      const result = res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });

      return result;
    }

    const newUser = await Users.createUser(req.body);
    const { id, email, subscription, avatarURL } = newUser;

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        id,
        email,
        avatarURL,
        subscription,
      },
    });
  } catch (e) {
    console.log("ERROR");
    next(e);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findUserByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "5h" });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  // console.log(req.user);
  await Users.updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const getUser = async (req, res, next) => {
  try {
    const { email, subscription } = await Users.findUserById(req.user.id);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.updateUser(userId, req.body);
    if (user) {
      return res
        .status(200)
        .json({ status: "success", code: "200", data: { user } });
    } else {
      return res.status(404).json({
        status: "error",
        code: "404",
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateAvatar = (req, res, next) => {
  try {
    return res.json({});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getUser,
  updateSubscription,
  updateAvatar,
};
