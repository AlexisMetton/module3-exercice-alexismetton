const pool = require("../config/db");

const Team = {
  getAllTeams: async () => {
    const query = "SELECT * FROM teams";
    const result = await pool.query(query);
    return result.rows;
  },

  createTeam: async ({ name, playerIds }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      const teamQuery = `
        INSERT INTO teams (name) VALUES ($1) RETURNING *;
      `;
      const teamValues = [name];
      const teamResult = await client.query(teamQuery, teamValues);
      const teamId = teamResult.rows[0].id;

      // Vérification des contraintes de rôle
      const roles = await client.query("SELECT role_id FROM characters WHERE id = ANY($1)", [playerIds]);
      const roleCounts = roles.rows.reduce((acc, { role_id }) => {
        acc[role_id] = (acc[role_id] || 0) + 1;
        return acc;
      }, {});

      if ((roleCounts[1] || 0) !== 1) throw new Error("Une équipe doit avoir exactement un Tank.");
      if ((roleCounts[3] || 0) !== 1) throw new Error("Une équipe doit avoir exactement un Soigneur.");
      if ((roleCounts[2] || 0) !== 3) throw new Error("Une équipe doit avoir exactement trois Dégâts.");

      const membersQuery = `
        INSERT INTO team_members (team_id, player_id)
        SELECT $1, unnest($2::int[]);
      `;
      await client.query(membersQuery, [teamId, playerIds]);

      await client.query("COMMIT");
      return teamResult.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  updateTeam: async (id, { name, playerIds }) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      const updateQuery = `
        UPDATE teams SET name = $1 WHERE id = $2 RETURNING *;
      `;
      const updateValues = [name, id];
      const result = await client.query(updateQuery, updateValues);

      await client.query("DELETE FROM team_members WHERE team_id = $1", [id]);
      
      // Vérification des contraintes de rôle
      const roles = await client.query("SELECT role_id FROM characters WHERE id = ANY($1)", [playerIds]);
      const roleCounts = roles.rows.reduce((acc, { role_id }) => {
        acc[role_id] = (acc[role_id] || 0) + 1;
        return acc;
      }, {});

      if ((roleCounts[1] || 0) !== 1) throw new Error("Une équipe doit avoir exactement un Tank.");
      if ((roleCounts[3] || 0) !== 1) throw new Error("Une équipe doit avoir exactement un Soigneur.");
      if ((roleCounts[2] || 0) !== 3) throw new Error("Une équipe doit avoir exactement trois Dégâts.");

      await client.query(
        "INSERT INTO team_members (team_id, player_id) SELECT $1, unnest($2::int[]);",
        [id, playerIds]
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
    await pool.query("DELETE FROM team_members WHERE team_id = $1", [id]);
    await pool.query("DELETE FROM teams WHERE id = $1", [id]);
    return { message: "Équipe supprimée" };
  }
};

module.exports = Team;
