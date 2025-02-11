const pool = require("../config/db");

const Dungeons = {
  getAllDungeons: async () => {
    const query = "SELECT * FROM dungeons";
    const result = await pool.query(query);
    return result.rows;
  },
}

module.exports = Dungeons;
