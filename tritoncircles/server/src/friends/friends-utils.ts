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
  try {
    const friendRequest = await db.get(
      "SELECT * FROM friend_requests WHERE sender_id = ? AND status = 'pending'",
      [id]
    );

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found or already processed." });
    }

    // Insert the friendship into the friends table
    await db.run(
      "INSERT INTO friends (connection, friendship_date) VALUES (?, ?)",
      [friendRequest.connection, friendRequest.date]
    );

    // Update the friend request's status to "accepted"
    await db.run("UPDATE friend_requests SET status = 'accepted' WHERE sender_id = ?", [id]);

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
    const userIdString = `${userId},`; // Match connections where the user is the first part
    const reversedUserIdString = `,${userId}`; // Match connections where the user is the second part

    const events = await db.all(
      `
      SELECT 
        e.event_id AS id, 
        e.title, 
        e.date, 
        e.room, 
        e.incentives
      FROM events e
      JOIN friends_interested_events fie ON e.event_id = fie.event_id
      JOIN friends f ON f.connection LIKE ? OR f.connection LIKE ?
      WHERE fie.friend_id = CAST(SUBSTR(f.connection, INSTR(f.connection, ',') + 1) AS INTEGER)
         OR fie.friend_id = CAST(SUBSTR(f.connection, 1, INSTR(f.connection, ',') - 1) AS INTEGER)
      `,
      [`${userIdString}%`, `%${reversedUserIdString}`]
    );


    res.status(200).json({ data: events });
  } catch (err) {
    console.error("Error fetching friends' interested events:", err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
}
