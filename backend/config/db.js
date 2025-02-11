require("dotenv").config();
const { Pool, Client } = require("pg");

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

// Fonction pour créer la base de données si elle n'existe pas
const createDatabase = async () => {
  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DATABASE}'`
    );
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.DATABASE}`);
      console.log(
        `Base de données '${process.env.DATABASE}' créée avec succès`
      );
    } else {
      console.log(
        `ℹ️ La base de données '${process.env.DATABASE}' existe déjà`
      );
    }
    await client.end();
  } catch (err) {
    console.error("Erreur lors de la création de la base de données :", err);
  }
};

// Connexion au pool après création de la base
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

const classes = {
  warrior: { label: "Guerrier", roles: ["tank", "damage"] },
  paladin: { label: "Paladin", roles: ["tank", "damage", "healer"] },
  hunter: { label: "Chasseur", roles: ["damage"] },
  rogue: { label: "Voleur", roles: ["damage"] },
  priest: { label: "Prêtre", roles: ["damage", "healer"] },
  shaman: { label: "Chaman", roles: ["damage", "healer"] },
  mage: { label: "Mage", roles: ["damage"] },
  warlock: { label: "Démoniste", roles: ["damage"] },
  monk: { label: "Moine", roles: ["damage"] },
  druid: { label: "Druide", roles: ["tank", "damage", "healer"] },
  dh: { label: "Chasseur de démon", roles: ["tank", "damage"] },
  dk: { label: "Chevalier de la mort", roles: ["tank", "damage"] },
  evoker: { label: "Évocateur", roles: ["healer", "damage"] },
};

const isTableEmpty = async (tableName) => {
  const result = await pool.query(`SELECT COUNT(*) FROM ${tableName};`);
  return parseInt(result.rows[0].count, 10) === 0;
};

const insertRoles = async () => {
  if (await isTableEmpty("roles")) {
    const roleNames = ["tank", "damage", "healer"];
    for (const role of roleNames) {
      await pool.query(
        `INSERT INTO roles (label) VALUES ($1) ON CONFLICT (label) DO NOTHING;`,
        [role]
      );
    }
    console.log("ℹ️ Rôles insérés avec succès.");
  } else {
    console.log(
      "ℹ️ La table `roles` contient déjà des données, pas d'insertion."
    );
  }
};

const insertClasses = async () => {
  if (await isTableEmpty("class")) {
    for (const key in classes) {
      const className = classes[key].label;
      const result = await pool.query(
        `INSERT INTO class (label) VALUES ($1) ON CONFLICT (label) DO NOTHING RETURNING id;`,
        [className]
      );

      const classID = result.rows[0]?.id;
      if (!classID) continue;

      for (const role of classes[key].roles) {
        const roleRes = await pool.query(
          `SELECT id FROM roles WHERE label = $1;`,
          [role]
        );
        if (roleRes.rowCount > 0) {
          const roleID = roleRes.rows[0].id;
          await pool.query(
            `INSERT INTO can_be (role_ID, class_ID) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
            [roleID, classID]
          );
        }
      }
    }
    console.log("ℹ️ Classes et relations rôles-classes insérées avec succès.");
  } else {
    console.log(
      "ℹ️ La table `class` contient déjà des données, pas d'insertion."
    );
  }
};

const insertDungeons = async () => {
  if (await isTableEmpty("dungeons")) {
    const dungeons = [
      { name: "The Stonevault", timer: 33 },
      { name: "The Dawnbreaker", timer: 35 },
      { name: "Ara-Kara, City of Echoes", timer: 30 },
      { name: "City of Threads", timer: 38 },
      { name: "Mists of Tirna Scithe", timer: 30 },
      { name: "The Necrotic Wake", timer: 36 },
      { name: "Siege of Boralus", timer: 36 },
      { name: "Grim Batol", timer: 34 }
    ];

    for (const dungeon of dungeons) {
      await pool.query(
        `INSERT INTO dungeons (name, timer) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
        [dungeon.name, dungeon.timer]
      );
    }
    console.log("✅ Donjons insérés avec succès.");
  } else {
    console.log("ℹ️ La table `dungeons` contient déjà des données, pas d'insertion.");
  }
};

// Fonction pour créer les tables
const createTables = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        label VARCHAR(50) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS class (
        id SERIAL PRIMARY KEY,
        label VARCHAR(50) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS characters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        class_ID INT REFERENCES class(id) ON DELETE SET NULL,
        role_ID INT REFERENCES roles(id) ON DELETE SET NULL,
        ilvl INT CHECK (ilvl BETWEEN 0 AND 645),
        rio INT CHECK (rio BETWEEN 0 AND 4500)
    );

    CREATE TABLE IF NOT EXISTS belong_to (
        character_id INT REFERENCES characters(id) ON DELETE CASCADE,
        player_id INT REFERENCES players(id) ON DELETE CASCADE,
        PRIMARY KEY (character_id, player_id)
    );

    CREATE TABLE IF NOT EXISTS tournament (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        entry_fee INT NOT NULL,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS registered (
        id SERIAL PRIMARY KEY,
        tournament_id INT REFERENCES tournament(id) ON DELETE CASCADE,
        parties_id INT REFERENCES parties(id) ON DELETE CASCADE,
        registration_date DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS dungeons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        timer INT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dungeon_times (
        id SERIAL PRIMARY KEY,
        tournament_id INT REFERENCES tournament(id) ON DELETE CASCADE,
        parties_id INT REFERENCES parties(id) ON DELETE CASCADE,
        dungeon_id INT REFERENCES dungeons(id) ON DELETE CASCADE,
        completion_time INT NOT NULL,
        valid BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS parties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS compose (
        parties_id INT REFERENCES parties(id) ON DELETE CASCADE,
        characters_id INT REFERENCES characters(id) ON DELETE CASCADE,
        PRIMARY KEY (parties_id, characters_id)
    );

    CREATE TABLE IF NOT EXISTS can_be (
        role_id INT REFERENCES roles(id) ON DELETE CASCADE,
        class_id INT REFERENCES class(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, class_id)
    );
    `;

  try {
    await pool.query(query);

    await insertRoles();
    await insertClasses();
    await insertDungeons();

    console.log("ℹ️ Tables créées avec succès");
  } catch (err) {
    console.error("ℹ️ Erreur lors de la création des tables :", err);
  }
};

// Exécuter la création de la base puis les tables
const initDatabase = async () => {
  await createDatabase();
  await createTables();
};

initDatabase();

module.exports = pool;
