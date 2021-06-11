// const fs = require('fs/promises')
const Contact = require("../model/schemas/contacts");

const listContacts = async (userId, query) => {
  const { limit = 20, page = 1, favorite = null } = query;
  const optionSearch = { owner: userId };

  if (favorite !== null) {
    optionSearch.favorite = favorite;
  }

  const result = await Contact.paginate(optionSearch, { limit, page });
  const { docs: contacts, totalDocs: total } = result;
  return { contacts, total, limit, page };
};

const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "email subscription",
  });
  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Contact.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    {
      _id: contactId,
      owner: userId,
    },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
