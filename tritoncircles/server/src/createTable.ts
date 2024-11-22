import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {
  const db = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database,
  });


  // Ensure tables are created or updated
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(50) NOT NULL,
      college VARCHAR(50),
      major VARCHAR(50),
      interests TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      event_id INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id INTEGER,
      title VARCHAR(256),
      date DATETIME,
      room VARCHAR(256),
      incentives TEXT,
      FOREIGN KEY(club_id) REFERENCES clubs(club_id),
      UNIQUE(club_id, title, date)
    );

    CREATE TABLE IF NOT EXISTS clubs (
      club_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(256) NOT NULL UNIQUE,
      description TEXT, 
      link TEXT
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
      sender_name VARCHAR(50),
      user_id INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending', 
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      UNIQUE(sender_id, user_id) 
    );

    CREATE TABLE IF NOT EXISTS friends (
      connection VARCHAR(255) PRIMARY KEY, -- Combined user_id and friend_id
      friendship_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );      

    CREATE TABLE IF NOT EXISTS friends_interested_events (
      friend_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      FOREIGN KEY(friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(event_id) REFERENCES events(event_id) ON DELETE CASCADE,
      PRIMARY KEY(friend_id, event_id)
    );
  `);

  return db;
};

export default initDB;
