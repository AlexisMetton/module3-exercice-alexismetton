const pool = require("../config/db");

const Class = {
  getAllClasses: async () => {
    const query = "SELECT * FROM class";
    const result = await pool.query(query);
    return result.rows;
  },

  getClassById: async (id) => {
    const query = "SELECT * FROM class WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = Class;
