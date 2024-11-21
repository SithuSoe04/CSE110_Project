import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {
  const db = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database,
  });

  // Drop existing tables (be careful with this in production!)
  await db.exec(`
    DROP TABLE IF EXISTS club_favorites;
    DROP TABLE IF EXISTS clubs;
  `);

  // Create tables
  await db.exec(`
    CREATE TABLE clubs (
      club_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(256) NOT NULL,
      description TEXT,
      link TEXT
    );

    CREATE TABLE club_favorites (
      user_id INTEGER NOT NULL,
      club_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, club_id),
      FOREIGN KEY (club_id) REFERENCES clubs (club_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );
  `);

  // Insert sample data
  await db.exec(`
    INSERT INTO clubs (name, description, link) VALUES
    ('Active Minds Club', 'Promoting mental health awareness.', 'https://studentorg.ucsd.edu/Home/Details/17085'),
    ('Anime and Manga Club', 'Anime and Manga enthusiasts.', 'https://studentorg.ucsd.edu/Home/Details/16945'),
    ('Badminton Club', 'For badminton lovers.', 'https://studentorg.ucsd.edu/Home/Details/17188'),
    ('ACM', 'Computer science and engineering club.', 'https://studentorg.ucsd.edu/Home/Details/16973');
  `);

  return db;
};

export default initDB;