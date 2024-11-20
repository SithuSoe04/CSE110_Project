import { Database } from "sqlite";
import { Request, Response } from "express";
import {
  getAllFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
} from "./friends-utils";

export function createFriendsEndpoints(app: any, db: Database) {
  // Fetch all friend requests
  app.get("/friends/requests", (req: Request, res: Response) => {
    try {
      const user_id = req.query.user_id as string; 
      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id query parameter" });
      }
      getAllFriendRequests(req, res, db, user_id);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Accept a friend request
  app.post("/friends/requests/:id/accept", (req: Request, res: Response) => {
    acceptFriendRequest(req, res, db);
  });

  // Decline a friend request
  app.delete("/friends/requests/:id", (req: Request, res: Response) => {
    declineFriendRequest(req, res, db);
  });

  app.get("/friends/interested-events", async (req: Request, res: Response) => {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: "Missing user_id query parameter" });
    }

    try {
      const events = await db.all(
        `
        SELECT e.event_id AS id, e.title, e.date, e.time, e.courseCode 
        FROM events e
        JOIN friends_interested_events fie ON e.event_id = fie.event_id
        JOIN friends f ON (f.user1_id = ? OR f.user2_id = ?)
        WHERE fie.friend_id = f.user1_id OR fie.friend_id = f.user2_id
        `,
        [userId, userId]
      );

      res.status(200).json({ data: events });
    } catch (err) {
      console.error("Error fetching friends' interested events:", err);
      res.status(500).json({ error: "Failed to fetch events." });
    }
  });
}

