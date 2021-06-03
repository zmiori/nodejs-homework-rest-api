const express = require("express");
const router = express.Router();

const guard = require("../../../helpers/guard");
const ctrl = require("../../../controllers/contacts");

const {
  validateAddContact,
  validateUpdateContact,
  validateStatusFavorite,
} = require("./validation");

router.get("/", guard, ctrl.getAll);

router.get("/:contactId", guard, ctrl.getById);

router.post("/", guard, validateAddContact, ctrl.add);

router.delete("/:contactId", guard, ctrl.remove);

router.put("/:contactId", guard, validateUpdateContact, ctrl.update);

router.patch(
  "/:contactId/favorite",
  guard,
  validateStatusFavorite,
  ctrl.isFavorite
);

module.exports = router;
