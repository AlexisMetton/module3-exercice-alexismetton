const pool = require("../config/db");

const Team = {
  getAllTeams: async () => {
    const query = `SELECT parties.id, parties.name, 
       COALESCE(json_agg(
           json_build_object('id', characters.id, 'name', characters.name, 
           'class_name', class.label, 'role_name', roles.label)
       ) FILTER (WHERE characters.id IS NOT NULL), '[]') AS characters
      FROM parties
      LEFT JOIN compose ON parties.id = compose.parties_id
      LEFT JOIN characters ON compose.characters_id = characters.id
      LEFT JOIN class ON characters.class_id = class.id
      LEFT JOIN roles ON characters.role_id = roles.id
      GROUP BY parties.id, parties.name;
      `;
    const result = await pool.query(query);
    return result.rows;
  },

  createTeam: async ({ name, charactersIds }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const teamQuery = `
        INSERT INTO parties (name) VALUES ($1) RETURNING *;
      `;
      const teamValues = [name];
      const teamResult = await client.query(teamQuery, teamValues);
      const teamId = teamResult.rows[0].id;

      // Vérification des contraintes de rôle
      const roles = await client.query(
        "SELECT role_id FROM characters WHERE id = ANY($1)",
        [charactersIds]
      );
      const roleCounts = roles.rows.reduce((acc, { role_id }) => {
        acc[role_id] = (acc[role_id] || 0) + 1;
        return acc;
      }, {});

      if ((roleCounts[1] || 0) !== 1)
        throw new Error("Une équipe doit avoir exactement un Tank.");
      if ((roleCounts[3] || 0) !== 1)
        throw new Error("Une équipe doit avoir exactement un Soigneur.");
      if ((roleCounts[2] || 0) !== 3)
        throw new Error("Une équipe doit avoir exactement trois Dégâts.");

      const membersQuery = `
        INSERT INTO compose (parties_id, characters_id)
        SELECT $1, unnest($2::int[]);
      `;
      await client.query(membersQuery, [teamId, charactersIds]);

      await client.query("COMMIT");
      return teamResult.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  updateTeam: async (id, { name, charactersIds }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updateQuery = `
        UPDATE parties SET name = $1 WHERE id = $2 RETURNING *;
      `;
      const updateValues = [name, id];
      const result = await client.query(updateQuery, updateValues);

      await client.query("DELETE FROM compose WHERE parties_id = $1", [id]);

      // Vérification des contraintes de rôle
      const roles = await client.query(
        "SELECT role_id FROM characters WHERE id = ANY($1)",
        [charactersIds]
      );
      const roleCounts = roles.rows.reduce((acc, { role_id }) => {
        acc[role_id] = (acc[role_id] || 0) + 1;
        return acc;
      }, {});

      if ((roleCounts[1] || 0) !== 1)
        throw new Error("Une équipe doit avoir exactement un Tank.");
      if ((roleCounts[3] || 0) !== 1)
        throw new Error("Une équipe doit avoir exactement un Soigneur.");
      if ((roleCounts[2] || 0) !== 3)
        throw new Error("Une équipe doit avoir exactement trois Dégâts.");

      await client.query(
        "INSERT INTO compose (parties_id, characters_id) SELECT $1, unnest($2::int[]);",
        [id, charactersIds]
      );

      await client.query("COMMIT");
      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  deleteTeam: async (id) => {
    await pool.query("DELETE FROM compose WHERE parties_id = $1", [id]);
    await pool.query("DELETE FROM parties WHERE id = $1", [id]);
    return { message: "Équipe supprimée" };
  },

  getTeamById: async (id) => {
    const query = `
      SELECT parties.id, parties.name, 
        COALESCE(json_agg(
          json_build_object('id', characters.id, 'name', characters.name, 
          'class_name', class.label, 'role_name', roles.label)
        ) FILTER (WHERE characters.id IS NOT NULL), '[]') AS characters
      FROM parties
      LEFT JOIN compose ON parties.id = compose.parties_id
      LEFT JOIN characters ON compose.characters_id = characters.id
      LEFT JOIN class ON characters.class_id = class.id
      LEFT JOIN roles ON characters.role_id = roles.id
      WHERE parties.id = $1
      GROUP BY parties.id, parties.name;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = Team;
