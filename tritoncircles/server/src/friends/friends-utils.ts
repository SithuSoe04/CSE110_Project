import { Database } from "sqlite";
import { Request, Response } from "express";

export async function getAllFriendRequests(
  req: Request,
  res: Response,
  db: Database,
  userId: string
) {
  try {
    // console.log("Fetching friend requests for user_id:", userId);
    const friendRequests = await db.all(
      "SELECT * FROM friend_requests WHERE user_id = ?",
      [userId]
    );
    // console.log("Friend requests result:", friendRequests); 
    res.status(200).json({ data: friendRequests });
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    res.status(500).json({ error: "Failed to fetch friend requests." });
  }
}

export async function acceptFriendRequest(req: Request, res: Response, db: Database) {
  const { id } = req.params;
  const userId = req.body.user_id;

  try {
    const friendRequest = await db.get(
      "SELECT * FROM friend_requests WHERE sender_id = ? AND user_id = ? AND status = 'pending'",
      [id, userId]
    );

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found or already processed." });
    }

    const connection = `${friendRequest.sender_id}-${friendRequest.user_id}`;
    const friendshipDate = new Date().toISOString();

    // Insert the friendship into the friends table
    await db.run(
      "INSERT INTO friends (connection, friendship_date) VALUES (?, ?)",
      [connection, friendshipDate]
    );

    // Update the friend request's status to "accepted"
    await db.run("UPDATE friend_requests SET status = 'accepted' WHERE sender_id = ? AND user_id = ?", 
      [id, userId]
    );

    res.json({ message: "Friend request accepted.", status: "accepted" });
  } catch (err) {
    console.error("Error accepting friend request:", err);
    res.status(500).json({ error: "Failed to accept friend request." });
  }
}


export async function declineFriendRequest(req: Request, res: Response, db: Database) {
  const { id } = req.params;

  try {
    // Update the friend request's status to "declined"
    await db.run("UPDATE friend_requests SET status = 'declined' WHERE sender_id = ?", [id]);

    // Respond with success and updated status
    res.json({ message: "Friend request declined.", status: "declined" });
  } catch (err) {
    console.error("Error declining friend request:", err);
    res.status(500).json({ error: "Failed to decline friend request." });
  }
}


export async function getFriendsInterestedEvents(req: Request, res: Response, db: Database) {
  const userId = req.query.user_id;
  
    if (!userId) {
      return res.status(400).json({ error: "Missing user_id query parameter" });
    }
  
    try {
    const userIdString = `${userId},`; // Matches connections where user_id is first
    const reversedUserIdString = `,${userId}`; // Matches connections where user_id is second

    const events = await db.all(
      `
      SELECT
        fie.friend_id AS friendId,
        u.name AS friendName, 
        e.event_id AS id,
        e.title,
        e.date,
        e.room, 
        e.incentives, 
        c.name AS clubName
      FROM events e
      JOIN friends_interested_events fie ON e.event_id = fie.event_id
      JOIN friends f ON f.connection LIKE ? OR f.connection LIKE ?
      JOIN users u ON u.user_id = fie.friend_id
      JOIN clubs c ON e.club_id = c.club_id
      WHERE fie.friend_id = CAST(SUBSTR(f.connection, INSTR(f.connection, ',') + 1) AS INTEGER)
         OR fie.friend_id = CAST(SUBSTR(f.connection, 1, INSTR(f.connection, ',') - 1) AS INTEGER)
      `,
      [`${userIdString}%`, `%${reversedUserIdString}`]
    );
    
      res.status(200).json({ data: events || [] }); 
    } catch (err) {
      console.error("Error fetching friends' interested events:", err);
      res.status(500).json({ error: "Failed to fetch events." });
    }
}


export async function searchUsers(req: Request, res: Response, db: Database) {
  const query = req.query.query as string;
  
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }
  
    try {
      // Query the database for matching users (by name or ID)
      const users = await db.all(
        `
        SELECT user_id AS id, name 
        FROM users 
        WHERE name LIKE ? OR user_id LIKE ?
        `,
        [`%${query}%`, `%${query}%`]
      );
  
      if (users.length === 0) {
        return res.status(404).json({ error: "No users found." });
      }
  
      res.status(200).json({ user: users[0] }); 
    } catch (err) {
      console.error("Error searching for user:", err);
      res.status(500).json({ error: "Failed to search for user." });
    }
}

export async function sendRequests(req: Request, res: Response, db: Database) {
  const { sender_id, sender_name, recipient_id, message } = req.body;
  
    if (!sender_id || !recipient_id) {
      return res.status(400).json({ error: "Missing sender_id or recipient_id" });
    }
  
    try {
      // Check if the recipient exists
      const recipient = await db.get("SELECT * FROM users WHERE user_id = ?", [recipient_id]);
      if (!recipient) {
        return res.status(404).json({ error: "Recipient not found" });
      }
  
      // Check if a request already exists
      const existingRequest = await db.get(
        "SELECT * FROM friend_requests WHERE sender_id = ? AND user_id = ?",
        [sender_id, recipient_id]
      );
      if (existingRequest) {
        return res.status(400).json({ error: "Friend request already sent" });
      }
  
      // Insert the friend request
      await db.run(
        `INSERT INTO friend_requests (sender_id, sender_name, user_id, message) 
         VALUES (?, ?, ?, ?)`,
        [sender_id, sender_name, recipient_id, message || "Hi! Let's connect."]
      );
  
      res.status(200).json({ message: "Friend request sent successfully" });
    } catch (err) {
      console.error("Error sending friend request:", err);
      res.status(500).json({ error: "Failed to send friend request" });
    }
}

