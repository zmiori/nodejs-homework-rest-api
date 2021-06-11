const Contacts = require("../repository/users");
const { HttpCode } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  // console.log(req.query);
  try {
    const userId = req.user.id;
    const { contacts, total, limit, page } = await Contacts.listContacts(
      userId,
      req.query
    );
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { total, limit, page, contacts },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  console.log(req.params.contactId);
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    console.log(contact);
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: "success", code: HttpCode.OK, data: { contact } });
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

const add = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (
      // eslint-disable-next-line no-prototype-builtins
      req.body.hasOwnProperty("name") &
      // eslint-disable-next-line no-prototype-builtins
      req.body.hasOwnProperty("phone") &
      // eslint-disable-next-line no-prototype-builtins
      req.body.hasOwnProperty("email")
    ) {
      const contact = await Contacts.addContact({ ...req.body, owner: userId });
      return res
        .status(HttpCode.CREATED)
        .json({ status: "success", code: HttpCode.CREATED, data: { contact } });
    } else {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "missing required name field",
      });
    }
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "contact deleted",
      });
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

const update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "missing fields",
    });
  } else {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    try {
      if (contact) {
        return res.status(HttpCode.CREATED).json({
          status: "success",
          code: HttpCode.CREATED,
          data: { contact },
        });
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
  }
};

const isFavorite = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "missing field favorite",
    });
  }
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: "success", code: HttpCode.OK, data: { contact } });
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

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  isFavorite,
};
