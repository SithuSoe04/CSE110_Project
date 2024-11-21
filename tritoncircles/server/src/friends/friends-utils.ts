import { Database } from "sqlite";
import { Request, Response } from "express";

// Utility function to fetch all friend requests
export async function getAllFriendRequests(
  req: Request,
  res: Response,
  db: Database,
  userId: string
) {
  try {
    const friendRequests = await db.all(
      "SELECT * FROM friend_requests WHERE user_id = ? AND status = 'pending'",
      [userId]
    );
    res.status(200).json({ data: friendRequests });
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    res.status(500).json({ error: "Failed to fetch friend requests." });
  }
}

// Utility function to accept a friend request
export async function acceptFriendRequest(req: Request, res: Response, db: Database) {
  const { id } = req.params;

  try {
    // Fetch the friend request
    const friendRequest = await db.get("SELECT * FROM friend_requests WHERE request_id = ?", [id]);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found." });
    }

    // Insert the friendship into the friends table
    await db.run(
      "INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)",
      [friendRequest.user_id, friendRequest.sender_id, friendRequest.sender_id, friendRequest.user_id]
    );

    // Update the friend request's status to "accepted"
    await db.run("UPDATE friend_requests SET status = 'accepted' WHERE request_id = ?", [id]);

    // Respond with success and updated status
    res.json({ message: "Friend request accepted.", status: "accepted" });
  } catch (err) {
    console.error("Error accepting friend request:", err);
    res.status(500).json({ error: "Failed to accept friend request." });
  }
}

// Utility function to decline a friend request
export async function declineFriendRequest(req: Request, res: Response, db: Database) {
  const { id } = req.params;

  try {
    // Update the friend request's status to "declined"
    await db.run("UPDATE friend_requests SET status = 'declined' WHERE request_id = ?", [id]);

    // Respond with success and updated status
    res.json({ message: "Friend request declined.", status: "declined" });
  } catch (err) {
    console.error("Error declining friend request:", err);
    res.status(500).json({ error: "Failed to decline friend request." });
  }
}

// Utility function to fetch friends' interested events
export async function getFriendsInterestedEvents(req: Request, res: Response, db: Database) {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: "Missing user_id query parameter" });
  }

  try {
    const events = await db.all(
      `
      SELECT e.event_id AS id, e.title, e.date, e.room, e.incentives
      FROM events e
      JOIN friends_interested_events fie ON e.event_id = fie.event_id
      JOIN friends f ON (f.user_id = ? OR f.friend_id = ?)
      WHERE fie.friend_id = f.friend_id OR fie.friend_id = f.user_id
      `,
      [userId, userId]
    );

    res.status(200).json({ data: events });
  } catch (err) {
    console.error("Error fetching friends' interested events:", err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
}
