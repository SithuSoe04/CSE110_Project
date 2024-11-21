import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {
  const db = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database,
  });

  // Fully clear data from all tables
  await db.exec(`
    DELETE FROM users;
    DELETE FROM events;
    DELETE FROM clubs;
    DELETE FROM friend_requests;
    DELETE FROM friends;
    DELETE FROM friends_interested_events;
  `);

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
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS friend_requests (
      request_id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      sender_name VARCHAR(50),
      user_id INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      message TEXT,
      FOREIGN KEY(sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      UNIQUE(sender_id, user_id, status)
    );

    CREATE TABLE IF NOT EXISTS friends (
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      friendship_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
      PRIMARY KEY(user_id, friend_id)
    );

    CREATE TABLE IF NOT EXISTS friends_interested_events (
      friend_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      FOREIGN KEY(friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(event_id) REFERENCES events(event_id) ON DELETE CASCADE,
      PRIMARY KEY(friend_id, event_id)
    );
  `);

  // Insert sample data into all tables
  await db.exec(`
    -- Sample data for users table
    INSERT INTO users (name, email, password, college, major, interests)
    VALUES 
      ('Alice', 'alice@example.com', 'password123', 'Engineering', 'CSE', 'AI, Robotics'),
      ('Bob', 'bob@example.com', 'password123', 'Science', 'Physics', 'Quantum Computing'),
      ('Charlie', 'charlie@example.com', 'password123', 'Arts', 'Literature', 'Writing, Poetry');

    -- Sample data for clubs table
    INSERT INTO clubs (name, description)
    VALUES
      ('CSES', 'Computer Science and Engineering Society'),
      ('Physics Club', 'Exploring the world of physics and beyond');

    -- Sample data for events table
    INSERT INTO events (club_id, title, date, room, incentives)
    VALUES
      (1, 'Software Engineering 101', '2024-12-10 14:00:00', 'CSE1202', 'Food, Networking'),
      (1, 'Advanced Robotics', '2024-12-15 10:00:00', 'Robotics Lab', 'Hands-on Workshop'),
      (2, 'Quantum Physics Meetup', '2024-12-20 16:00:00', 'Physics Building', 'Guest Lectures');

    -- Sample data for friend_requests table
    INSERT INTO friend_requests (sender_id, sender_name, user_id, status, message)
    VALUES
      (1, 'Alice', 3, 'pending', 'Hi Charlie, let us connect!'),
      (2, 'Bob', 3, 'pending', 'Hi Charlie, looking forward to collaborating!');

    -- Sample data for friends table
    INSERT INTO friends (user_id, friend_id, friendship_date)
    VALUES
      (3, 2, '2024-01-01 10:00:00'),
      (3, 1, '2024-01-05 15:30:00');

    -- Sample data for friends_interested_events table
    INSERT INTO friends_interested_events (friend_id, event_id)
    VALUES
      (1, 1), -- Alice is interested in Software Engineering 101
      (2, 2); -- Bob is interested in Advanced Robotics
  `);

  return db;
};

export default initDB;
