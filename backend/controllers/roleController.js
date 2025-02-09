const Role = require("../models/roleModel");

module.exports = {
  getRolesByClass: async (req, res) => {
    const { class_ID } = req.query;

    if (!class_ID) {
      return res.status(400).json({
        success: false,
        error: "L'identifiant de la classe est requis.",
      });
    }

    try {
      // 🔥 Récupérer les rôles liés à la classe sélectionnée
      const result = await Role.getRolesByClass(class_ID);

      res.status(200).json({
        success: true,
        roles: result,
      });
    } catch (err) {
      console.error("Erreur lors de la récupération des rôles :", err);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des rôles.",
      });
    }
  },
  getRoleById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Role.getRoleById(id);
      if (result) {
        res.status(200).json({ success: true, role: result });
      } else {
        res.status(404).json({ success: false, error: "Rôle introuvable." });
      }
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          error: "Erreur lors de la récupération du rôle.",
        });
    }
  },
  getRolesAll: async (req, res) => {
    try {
      const result = await Role.getRolesAll();

      res.status(200).json({
        success: true,
        roles: result,
      });
    } catch (err) {
      console.error("Erreur lors de la récupération des rôles :", err);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des rôles.",
      });
    }
  },
};
