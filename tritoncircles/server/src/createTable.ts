import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {
 // Open the database connection
 const db = await open({
   filename: "database.sqlite",
   driver: sqlite3.Database,
 });
 // Create an "events" table if it doesn't exist
 await db.exec(`
   CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
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
    FOREIGN KEY(club_id) REFERENCES clubs(club_id)
   );

   CREATE TABLE IF NOT EXISTS clubs (
    club_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(256),
    description TEXT
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
 `);
 return db;
};

export default initDB;