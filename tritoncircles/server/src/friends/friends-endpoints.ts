import { Database } from "sqlite";
import { Request, Response } from "express";
import { getAllFriendRequests, acceptFriendRequest, declineFriendRequest } from "./friends-utils";

export function createFriendsEndpoints(app: any, db: Database) {
  app.get("/friends/requests", async (req: Request, res: Response) => {
    try {
      const user_id = req.query.user_id as string; 
      console.log("user_id is", user_id);

      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id query parameter" });
      }
      
      await getAllFriendRequests(req, res, db, user_id);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // app.post("/friends/requests/:id/accept", (req: Request, res: Response) => {
  //   acceptFriendRequest(req, res, db);
  // });
  app.post("/friends/requests/:id/accept", async (req: Request, res: Response) => {
    try {
      await acceptFriendRequest(req, res, db);
    } catch (err) {
      console.error("Error accepting friend request:", err);
      res.status(500).json({ error: "Failed to accept friend request." });
    }
  });
  
  app.delete("/friends/requests/:id", (req: Request, res: Response) => {
    declineFriendRequest(req, res, db);
  });

  app.get("/friends/interested-events", async (req: Request, res: Response) => {
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
        e.event_id AS id,
        e.title,
        e.date,
        c.name AS clubName
      FROM
        events e
      JOIN
        friends_interested_events fie ON e.event_id = fie.event_id
      JOIN
        friends f ON f.connection LIKE ? OR f.connection LIKE ?
      JOIN
        clubs c ON e.club_id = c.club_id
      WHERE
        fie.friend_id = CAST(SUBSTR(f.connection, INSTR(f.connection, ',') + 1) AS INTEGER)
        OR
        fie.friend_id = CAST(SUBSTR(f.connection, 1, INSTR(f.connection, ',') - 1) AS INTEGER)
      `,
      [`${userIdString}%`, `%${reversedUserIdString}`]
    );
    
      res.status(200).json({ data: events || [] }); 
    } catch (err) {
      console.error("Error fetching friends' interested events:", err);
      res.status(500).json({ error: "Failed to fetch events." });
    }
  });


  app.get("/users/search", async (req: Request, res: Response) => {
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
  });
  

  app.post("/friends/requests", async (req: Request, res: Response) => {
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
  });
  
}  