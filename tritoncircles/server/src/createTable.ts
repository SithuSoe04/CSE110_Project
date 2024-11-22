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
    DELETE FROM event_favorites;
    DELETE FROM club_favorites;
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

  // Insert sample data into all tables
  await db.exec(`
    -- Sample data for users table
    INSERT INTO users (user_id, name, email, password, college, major, interests)
    VALUES 
      (1, 'Alice', 'alice@example.com', 'password123', 'Engineering', 'CSE', 'AI, Robotics'),
      (2, 'Bob', 'bob@example.com', 'password123', 'Science', 'Physics', 'Quantum Computing'),
      (3, 'Charlie', 'charlie@example.com', 'password123', 'Arts', 'Literature', 'Writing, Poetry');

    -- Sample data for clubs table
    INSERT INTO clubs (club_id, name, description)
    VALUES
      (1, 'CSES', 'Computer Science and Engineering Society'),
      (2, 'Physics Club', 'Exploring the world of physics and beyond');

    -- Sample data for events table
    INSERT INTO events (event_id, club_id, title, date, room, incentives)
    VALUES
      (1, 1, 'Software Engineering 101', '2024-12-10 14:00:00', 'CSE1202', 'Food, Networking'),
      (2, 1, 'Advanced Robotics', '2024-12-15 10:00:00', 'Robotics Lab', 'Hands-on Workshop'),
      (3, 2, 'Quantum Physics Meetup', '2024-12-20 16:00:00', 'Physics Building', 'Guest Lectures');

    -- Sample data for friend_requests table
    INSERT INTO friend_requests (sender_id, sender_name, user_id, status, message)
    VALUES
      (1, 'Alice', 3, 'pending', 'Hi Charlie, let us connect!'),
      (2, 'Bob', 3, 'pending', 'Hi Charlie, looking forward to collaborating!');

    -- Sample data for friends table
    INSERT INTO friends (connection, friendship_date)
    VALUES 
      ('3,1', '2024-01-01 10:00:00'), -- User 1 and User 2 are friends
      ('3,2', '2024-01-05 15:30:00'); -- User 1 and User 3 are friends

    -- Sample data for friends_interested_events table
    INSERT INTO friends_interested_events (friend_id, event_id)
    VALUES
      (1, 1), -- Alice is interested in Software Engineering 101
      (2, 2); -- Bob is interested in Advanced Robotics
  `);

  await db.exec(`
  -- Sample data for event_favorites table
  INSERT INTO event_favorites (user_id, event_id)
  VALUES
    (1, 1), -- Alice favors Software Engineering 101
    (1, 2), -- Alice also favors Advanced Robotics
    (2, 3), -- Bob favors Quantum Physics Meetup
    (3, 1); -- Charlie favors Software Engineering 101

  -- Sample data for club_favorites table
  INSERT INTO club_favorites (user_id, club_id)
  VALUES
    (1, 1), -- Alice favors the CSES club
    (2, 2), -- Bob favors the Physics Club
    (3, 1), -- Charlie favors the CSES club
    (3, 2); -- Charlie also favors the Physics Club
`);


  return db;
};

export default initDB;
