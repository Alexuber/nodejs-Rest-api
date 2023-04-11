const contactsService = require("../models/contacts");

const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    result ? res.json(result) : res.status(404).json("message : Not found");
  } catch (error) {
    next(error);
  }
};

const addNewContact = async (req, res, next) => {
  try {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    result
      ? res.status(200).json({
          message: "contact deleted",
        })
      : res.status(404).json({
          message: "Not found",
        });
  } catch (error) {
    next(error);
  }
};

const editContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (JSON.stringify(req.body) === "{}") {
      return res.status(400).json({ message: `missing fields` });
    }
    const result = await contactsService.updateContactById(contactId, req.body);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  addNewContact,
  getContactById,
  editContact,
  deleteContact,
};
