const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const pool = require("../config/db");

// 🔥 Route pour récupérer les rôles liés à une classe spécifique
router.get("/", roleController.getRolesByClass);
router.get("/liste", roleController.getRolesAll);
router.get("/:id", roleController.getRoleById);

module.exports = router;
