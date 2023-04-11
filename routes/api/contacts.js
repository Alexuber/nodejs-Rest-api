const express = require("express");
const contactsController = require("../../controllers/contacts");
const router = express.Router();
const { validateBody } = require("../../utils/validateBody");
const schemas = require("../../schema/contacts");

router.get("/", contactsController.getAllContacts);

router.get("/:contactId", contactsController.getContactById);

router.post(
  "/",
  validateBody(schemas.contactAddSchema),
  contactsController.addNewContact
);

router.delete("/:contactId", contactsController.deleteContact);

router.put(
  "/:contactId",
  validateBody(schemas.contactUpdateSchema),
  contactsController.editContact
);

module.exports = router;
