// const fs = require('fs/promises')
const db = require("./db");
const { v4: uuidv4 } = require("uuid");

const listContacts = async () => {
  return db.get("contacts").value();
};

const getContactById = async (contactId) => {
  return db.get("contacts").find({ id: contactId }).value();
};

const removeContact = async (contactId) => {
  const [record] = db.get("contacts").remove({ id: contactId }).write();
  return record;
};

const addContact = async (body) => {
  const id = uuidv4();
  const contact = {
    id,
    ...body,
  };
  db.get("contacts").push(contact).write();
  return contact;
};

const updateContact = async (contactId, body) => {
  const record = db
    .get("contacts")
    .find({ id: contactId })
    .assign(body)
    .value();
  db.write();
  return record.id ? record : null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
