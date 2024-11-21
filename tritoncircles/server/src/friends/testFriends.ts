import { Database } from "sqlite";

export const seedFriendsData = async (db: Database) => {
  const sampleUsers = [
    { name: "Alice", email: "alice@example.com", password: "password123" },
    { name: "Bob", email: "bob@example.com", password: "password123" },
    { name: "Charlie", email: "charlie@example.com", password: "password123" },
    { name: "Diana", email: "diana@example.com", password: "password123" },
  ];

  const sampleFriendRequests = [
    { sender_id: 1, receiver_id: 2, status: "pending", message: "Hi, Bob!" },
    { sender_id: 3, receiver_id: 1, status: "pending", message: "Let's connect, Alice!" },
    { sender_id: 4, receiver_id: 3, status: "accepted", message: "Thanks for adding me!" },
  ];

  const sampleFriends = [
    { user1_id: 1, user2_id: 4 },
    { user1_id: 2, user2_id: 3 },
  ];

  const sampleFriendsInterestedEvents = [
    { friend_id: 1, event_id: 1 },
    { friend_id: 2, event_id: 2 },
    { friend_id: 3, event_id: 3 },
    { friend_id: 4, event_id: 1 },
  ];

  try {
    // Clear existing data
    await db.run("DELETE FROM friend_requests WHERE request_id > 0");
    await db.run("DELETE FROM friends WHERE user1_id > 0 OR user2_id > 0");
    await db.run("DELETE FROM friends_interested_events WHERE friend_id > 0");
    await db.run("DELETE FROM users WHERE user_id > 0");

    // Insert sample users
    for (const user of sampleUsers) {
      await db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [user.name, user.email, user.password]
      );
    }

    // Insert sample friend requests
    for (const request of sampleFriendRequests) {
      await db.run(
        "INSERT INTO friend_requests (sender_id, receiver_id, status, message) VALUES (?, ?, ?, ?)",
        [request.sender_id, request.receiver_id, request.status, request.message]
      );
    }

    // Insert sample friends
    for (const friend of sampleFriends) {
      await db.run(
        "INSERT INTO friends (user1_id, user2_id) VALUES (?, ?)",
        [friend.user1_id, friend.user2_id]
      );
    }

    // Insert sample friends interested in events
    for (const interest of sampleFriendsInterestedEvents) {
      await db.run(
        "INSERT INTO friends_interested_events (friend_id, event_id) VALUES (?, ?)",
        [interest.friend_id, interest.event_id]
      );
    }

    console.log("Sample friends data seeded successfully");
  } catch (error) {
    console.error("Error seeding friends data:", error);
    throw error;
  }
};
