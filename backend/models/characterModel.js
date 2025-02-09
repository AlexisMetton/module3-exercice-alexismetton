const pool = require("../config/db");

const Character = {
  getAllCharacters: async () => {
    const query = "SELECT * FROM characters";
    const result = await pool.query(query);
    return result.rows;
  },

  createCharacter: async ({ name, class_ID, role_ID, ilvl, rio }) => {
    const query = `
      INSERT INTO characters (name, class_ID, role_ID, ilvl, rio)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [name, class_ID, role_ID, ilvl, rio];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  updateCharacter: async (id, { name, class_ID, role_ID, ilvl, rio }) => {
    const query = `
      UPDATE characters 
      SET name = $1, class_ID = $2, role_ID = $3, ilvl = $4, rio = $5
      WHERE id = $6 RETURNING *;
    `;
    const values = [name, class_ID, role_ID, ilvl, rio, id];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  deleteCharacter: async (id) => {
    const query = "DELETE FROM characters WHERE id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  getCharacterById: async (id) => {
    const query = "SELECT * FROM characters WHERE id = $1;";
    const { rows } = await  pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Character;
