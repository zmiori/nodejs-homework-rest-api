const express = require("express");
const router = express.Router();
const Contacts = require("../../model/contacts");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({ status: "success", code: "200", data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  console.log(req.params.contactId);
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    console.log(contact);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: "200", data: { contact } });
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
});

router.post("/", async (req, res, next) => {
  try {
    if (
      // eslint-disable-next-line no-prototype-builtins
      req.body.hasOwnProperty("name") &
      // eslint-disable-next-line no-prototype-builtins
      req.body.hasOwnProperty("phone") &
      // eslint-disable-next-line no-prototype-builtins
      req.body.hasOwnProperty("email")
    ) {
      const contact = await Contacts.addContact(req.body);
      return res
        .status(201)
        .json({ status: "success", code: "201", data: { contact } });
    } else {
      return res.status(400).json({
        status: "error",
        code: "400",
        message: "missing required name field",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: "error",
      code: "400",
      message: "missing fields",
    });
  } else {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body
    );
    try {
      if (contact) {
        return res
          .status(201)
          .json({ status: "success", code: "201", data: { contact } });
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
  }
});

module.exports = router;
