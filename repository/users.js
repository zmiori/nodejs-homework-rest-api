const User = require("../model/schemas/user");

const findUserById = async (id) => {
  return await User.findOne({ _id: id });
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (options) => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateUser = async (id, body) => {
  const result = await User.findByIdAndUpdate(
    {
      _id: id,
    },
    { ...body },
    { new: true }
  );
  return result;
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};

const updateVerificationToken = async (id, verify, verificationToken) => {
  return await User.updateOne({ _id: id }, { verificationToken, verify });
};

const findUserByVetificationToken = async (verificationToken) => {
  return await User.findOne({
    verificationToken: verificationToken,
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateToken,
  updateUser,
  updateAvatar,
  updateVerificationToken,
  findUserByVetificationToken,
};
