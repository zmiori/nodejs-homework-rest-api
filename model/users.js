const User = require("./schemas/user");

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

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateToken,
  updateUser,
};
