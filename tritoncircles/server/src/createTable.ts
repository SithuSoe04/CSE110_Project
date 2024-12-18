import sqlite3 from "sqlite3";
import { open } from "sqlite";
import {eventData, recruitmentData, clubData} from './constants'

async function resetAutoIncrement(db: sqlite3.Database, tableName: string) {
    await db.run(`DELETE FROM sqlite_sequence WHERE name='${tableName}';`);
  }

const initDB = async () => {
  // Open the database connection
  const db = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database,
  });

  // await db.exec(`
  //   DELETE FROM users;
  //   DELETE FROM events;
  //   DELETE FROM clubs;
  //   DELETE FROM event_favorites;
  //   DELETE FROM club_favorites;
  //   DELETE FROM friend_requests;
  //   DELETE FROM friends;
  //   DELETE FROM friends_interested_events;
  // `);

  // await db.exec(`DELETE FROM sqlite_sequence WHERE name='users';`);
  // await db.exec(`DELETE FROM sqlite_sequence WHERE name='events';`);
  // await db.exec(`DELETE FROM sqlite_sequence WHERE name='clubs';`);
  // await db.exec(`DELETE FROM sqlite_sequence WHERE name='event_favorites';`);
  // await db.exec(`DELETE FROM sqlite_sequence WHERE name='club_favorites';`);
  // await db.exec(`DELETE FROM sqlite_sequence WHERE name='friend_requests';`);
  // await db.exec(`DELETE FROM sqlite_sequence WHERE name='friends';`);
  // await db.exec(`DELETE FROM sqlite_sequence WHERE name='friends_interested_events';`);

  await db.exec(`
   CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(50) NOT NULL,
      private INTEGER DEFAULT 0,
      college VARCHAR(50),
      major VARCHAR(50),
      year VARCHAR(50),
      minor VARCHAR(50),
      securityQuestion VARCHAR(255),
      securityAnswer VARCHAR(255),
      bio TEXT,
      profile_pic TEXT
    );

    CREATE TABLE IF NOT EXISTS user_interests(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_ID INTEGER,
    interest TEXT,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
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

    CREATE TABLE IF NOT EXISTS recruitment (
      recruitment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id INTEGER,
      title VARCHAR(256),
      date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
      deadline DATETIME,
      application_link TEXT,
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
  
    // Seed the clubs table with 100 clubs
  // const clubs = [
  //   { name: "Filipino Student Association (FSA)", description: "Celebrates Filipino culture and community.", link: "https://studentorg.ucsd.edu/Home/Details/17095" },
  //   { name: "Finance Club", description: "Supports students pursuing careers in finance with resources and mentorship.", link: "https://studentorg.ucsd.edu/Home/Details/17096" },
  //   { name: "Fire Spinners Club", description: "Teaches and performs the art of fire spinning and flow arts.", link: "https://studentorg.ucsd.edu/Home/Details/17097" },
  //   { name: "Formula SAE", description: "Designs and builds race cars for national competitions.", link: "https://studentorg.ucsd.edu/Home/Details/17098" },
  //   { name: "French Club", description: "Celebrates French culture and language with events and activities.", link: "https://studentorg.ucsd.edu/Home/Details/17099" },
  //   { name: "Game Development Club", description: "Connects students interested in designing and building video games.", link: "https://studentorg.ucsd.edu/Home/Details/17100" }
  // ];

  // for (const club of clubs) {
  //   await db.run(
  //     "INSERT INTO clubs (name, description, link) VALUES (?, ?, ?)",
  //     [club.name, club.description, club.link]
  //   );
  // }

  // console.log("Seeded 100 clubs into the database");

  console.log("Database initialized with tables:");
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  tables.forEach(table => console.log(`- ${table.name}`));

  return db;
};

export default initDB;
