const express = require("express");
const router = express.Router();

const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const ctrl = require("../../../controllers/users");

const { validateUser } = require("./validation");

router.post("/signup", validateUser, ctrl.register);
router.post("/login", validateUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.getUser);
router.patch("/subscription", guard, ctrl.updateSubscription);
router.patch("/avatars", [guard, upload.single("avatar")], ctrl.updateAvatar);

module.exports = router;
