const pool = require("../config/db");

const Role = {
  getRolesByClass: async (class_id) => {
    const query = `SELECT r.id, r.label FROM roles r
         INNER JOIN can_be cb ON cb.role_ID = r.id
         WHERE cb.class_ID = $1`;
    const result = await pool.query(query, [class_id]);
    return result.rows;
  },

  getRoleById: async (id) => {
    const query = "SELECT * FROM roles WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  getRolesAll: async () => {
    const query = `SELECT * FROM roles`;
    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = Role;
