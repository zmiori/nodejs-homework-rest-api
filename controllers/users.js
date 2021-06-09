const jwt = require("jsonwebtoken");
require("dotenv").config();

const Users = require("../repository/users");
const { HttpCode } = require("../helpers/constants");
const UploadAvatar = require("../services/upload-avatars");
const EmailService = require("../services/email");
const CreateSender = require("../services/email-sender");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

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
    const { id, name, email, subscription, avatarURL, verificationToken } =
      newUser;
    // send email
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSender()
      );

      await emailService.sendVerificationEmail(verificationToken, email, name);
    } catch (e) {
      console.log(e.message);
    }

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

    if (!user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message:
          "Your account is not verified. Please check your email to complete registration",
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
        .status(HttpCode.OK)
        .json({ status: "success", code: HttpCode.OK, data: { user } });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatar(AVATARS_OF_USERS);
    const avatarURL = await uploads.saveAvatarToStatic({
      userId: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarURL,
    });
    await Users.updateAvatar(id, avatarURL);
    return res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data: { avatarURL } });
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
