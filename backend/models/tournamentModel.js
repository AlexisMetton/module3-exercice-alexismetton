const pool = require("../config/db");

const Tournament = {
  getAllTournaments: async () => {
    const result = await pool.query("SELECT * FROM tournament");
    return result.rows;
  },

  createTournament: async ({ name, start_date, end_date, entry_fee, description }) => {
    const result = await pool.query(
      `INSERT INTO tournament (name, start_date, end_date, entry_fee, description)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, start_date, end_date, entry_fee, description]
    );
    return result.rows[0];
  },

  updateTournament: async (id, { name, start_date, end_date, entry_fee, description }) => {
    const checkResult = await pool.query(
        "SELECT end_date FROM tournament WHERE id = $1", 
        [id]
    );
    if (checkResult.rows.length === 0) {
        throw new Error("Tournoi introuvable.");
    }

    const endDate = new Date(checkResult.rows[0].end_date);
    if (endDate < new Date()) {
        throw new Error("Impossible de modifier un tournoi terminé.");
    }

    const result = await pool.query(
      `UPDATE tournament SET name = $1, start_date = $2, end_date = $3, entry_fee = $4, description = $5 
      WHERE id = $6 RETURNING *;`,
      [name, start_date, end_date, entry_fee, description, id]
    );
    return result.rows[0];
  },

  deleteTournament: async (id) => {
    await pool.query("DELETE FROM registered WHERE tournament_id = $1", [id]);
    await pool.query("DELETE FROM dungeon_times WHERE tournament_id = $1", [id]);
    await pool.query("DELETE FROM tournament WHERE id = $1", [id]);

    return { message: "Tournoi supprimé" };
  },

  getTournamentById: async (id) => {
    const query = "SELECT * FROM tournament WHERE id = $1;";
    const { rows } = await  pool.query(query, [id]);
    return rows[0];
  },

  getTournamentTeams: async (tournament_id) => {
    const result = await pool.query(
      `SELECT parties.* FROM parties 
       INNER JOIN registered ON parties.id = registered.parties_id
       WHERE registered.tournament_id = $1`,
      [tournament_id]
    );
    return result.rows;
  },

  getTournamentRanking: async (tournament_id) => {
    const query = `
      SELECT 
        t.name AS team_name, 
        dt.completion_time AS best_time, 
        d.name AS dungeon_name, 
        d.timer AS dungeon_timer,
        (d.timer - dt.completion_time) AS time_advance
      FROM dungeon_times dt
      INNER JOIN parties t ON dt.parties_id = t.id
      INNER JOIN dungeons d ON dt.dungeon_id = d.id
      WHERE dt.tournament_id = $1 AND dt.valid = TRUE
      ORDER BY time_advance DESC;
    `;

    const result = await pool.query(query, [tournament_id]);
    return result.rows;
},

  getCashPrize: async (tournament_id) => {
    const result = await pool.query(
      `SELECT SUM(entry_fee) AS cash_prize FROM tournament 
       INNER JOIN registered ON tournament.id = registered.tournament_id 
       WHERE tournament.id = $1;`,
      [tournament_id]
    );
    return result.rows[0].cash_prize;
  },

  addTeamToTournament: async (tournament_id, parties_id) => {
    const checkExisting = await pool.query(
        "SELECT 1 FROM registered WHERE tournament_id = $1 AND parties_id = $2",
        [tournament_id, parties_id]
      );
    
      if (checkExisting.rowCount > 0) {
        throw new Error("Cette équipe est déjà inscrite dans ce tournoi.");
      }

    await pool.query(
      "INSERT INTO registered (tournament_id, parties_id) VALUES ($1, $2)",
      [tournament_id, parties_id]
    );
    return { message: "Équipe ajoutée au tournoi" };
  },

  addDungeonTime: async (tournament_id, parties_id, dungeon_id, completion_time) => {
    const dungeon = await pool.query("SELECT timer FROM dungeons WHERE id = $1", [dungeon_id]);
    const timer = dungeon.rows[0]?.timer;

    if (!timer) {
      throw new Error("Donjon introuvable");
    }

    const valid = completion_time < timer;

    const result = await pool.query(
      `INSERT INTO dungeon_times (tournament_id, parties_id, dungeon_id, completion_time, valid)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [tournament_id, parties_id, dungeon_id, completion_time, valid]
    );

    return result.rows[0];
  },

  getTeamToTournament: async (tournament_id) => {
    const query = `
      SELECT parties.* 
      FROM parties
      INNER JOIN registered ON parties.id = registered.parties_id
      WHERE registered.tournament_id = $1;
    `;

    const result = await pool.query(query, [tournament_id]);

    if (result.rowCount === 0) {
      throw new Error("Cette équipe n'est pas inscrite à ce tournoi.");
    }

    return result.rows;
  },

  removeTeamFromTournament: async (tournament_id, team_id) => {
    await pool.query("DELETE FROM registered WHERE tournament_id = $1 AND parties_id = $2", [tournament_id, team_id]);
  },
  
  getDungeonTimes: async (tournament_id) => {
    const query = `
      SELECT 
        dungeons.name AS dungeon_name, 
        parties.name AS team_name, 
        dungeon_times.completion_time, 
        dungeon_times.valid
      FROM dungeon_times
      INNER JOIN dungeons ON dungeon_times.dungeon_id = dungeons.id
      INNER JOIN parties ON dungeon_times.parties_id = parties.id
      WHERE dungeon_times.tournament_id = $1
      ORDER BY dungeons.name, dungeon_times.completion_time ASC;
    `;
  
    const result = await pool.query(query, [tournament_id]);
    return result.rows;
  },  
};

module.exports = Tournament;
