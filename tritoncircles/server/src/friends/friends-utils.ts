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
      "SELECT * FROM friend_requests WHERE user_id = ?",
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
    const friendRequest = await db.get("SELECT * FROM friend_requests WHERE id = ?", [id]);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found." });
    }
    await db.run("DELETE FROM friend_requests WHERE id = ?", [id]);
    await db.run("INSERT INTO friends (name, message) VALUES (?, ?)", [friendRequest.name, friendRequest.message]);
    res.json({ message: "Friend request accepted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept friend request." });
  }
}

// Utility function to decline a friend request
export async function declineFriendRequest(req: Request, res: Response, db: Database) {
  const { id } = req.params;
  try {
    await db.run("DELETE FROM friend_requests WHERE id = ?", [id]);
    res.json({ message: "Friend request declined." });
  } catch (err) {
    res.status(500).json({ error: "Failed to decline friend request." });
  }
}

