const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const pool = require("../config/db");

// 🔥 Route pour récupérer toutes les classes
router.get("/", classController.getAllClasses);
router.get("/:id", classController.getClassById);

module.exports = router;
