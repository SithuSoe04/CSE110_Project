import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {
  // Open the database connection
  const db = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
   CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(50) NOT NULL,
      college VARCHAR(50),
      major VARCHAR(50),
      year VARCHAR(50),
      minor VARCHAR(50),
      securityQuestion VARCHAR(255),
      securityAnswer VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS temp_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(50) NOT NULL,
      college VARCHAR(50),
      major VARCHAR(50),
      year VARCHAR(50),
      minor VARCHAR(50),
      securityQuestion VARCHAR(255),
      securityAnswer VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS clubs (
      club_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(256) NOT NULL,
      description TEXT,
      link TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      event_id INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id INTEGER,
      title VARCHAR(256),
      date DATETIME,
      room VARCHAR(256),
      incentives TEXT,
      FOREIGN KEY(club_id) REFERENCES clubs(club_id)
    );

    CREATE TABLE IF NOT EXISTS event_favorites (
      user_id INTEGER,
      event_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(user_id),
      FOREIGN KEY(event_id) REFERENCES events(event_id),
      PRIMARY KEY(user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS club_favorites (
      user_id INTEGER,
      club_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(user_id),
      FOREIGN KEY(club_id) REFERENCES clubs(club_id),
      PRIMARY KEY(user_id, club_id)
    );

    CREATE TABLE IF NOT EXISTS friend_requests (
      request_id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', or 'declined'
      message TEXT,
      FOREIGN KEY(sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS friends (
      user1_id INTEGER NOT NULL,
      user2_id INTEGER NOT NULL,
      friendship_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user1_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(user2_id) REFERENCES users(user_id) ON DELETE CASCADE,
      PRIMARY KEY(user1_id, user2_id)
    );

    CREATE TABLE IF NOT EXISTS friends_interested_events (
      friend_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      interested_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(event_id) REFERENCES events(event_id) ON DELETE CASCADE,
      PRIMARY KEY(friend_id, event_id)
    );
  `);

  // Seed the clubs table if it's empty
  // const existingClubs = await db.all("SELECT * FROM clubs");
  // if (existingClubs.length === 0) {
  //   await db.exec(`
  //     INSERT INTO clubs (name, description, link) VALUES
  //     ('Active Minds Club', 'Promoting mental health awareness.', 'https://studentorg.ucsd.edu/Home/Details/17085'),
  //     ('Anime and Manga Club', 'Anime and Manga enthusiasts.', 'https://studentorg.ucsd.edu/Home/Details/16945'),
  //     ('Badminton Club', 'For badminton lovers.', 'https://studentorg.ucsd.edu/Home/Details/17188'),
  //     ('ACM', 'Computer science and engineering club.', 'https://studentorg.ucsd.edu/Home/Details/16973');
  //   `);
  //   console.log("Seeded clubs table with initial data");
  // }

  // Log tables created
  console.log("Database initialized with tables:");
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  tables.forEach(table => console.log(`- ${table.name}`));
  
  return db;
};

export default initDB;