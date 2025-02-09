const ctrlWrapper = require("../utils/ctrlWrapper");

const { Contact } = require("../models/contact");

const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    result ? res.json(result) : res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const addNewContact = async (req, res, next) => {
  try {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
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
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      req.body,
      { new: true }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const editFavoriteField = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (JSON.stringify(req.body) === "{}") {
      return res.status(400).json({ message: `missing field "favorite"` });
    }
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      req.body,
      { new: true }
    );
    if (!result) {
      return res.status(400).json({ message: `Not found` });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  addNewContact: ctrlWrapper(addNewContact),
  getContactById: ctrlWrapper(getContactById),
  editContact: ctrlWrapper(editContact),
  deleteContact: ctrlWrapper(deleteContact),
  editFavoriteField: ctrlWrapper(editFavoriteField),
};
