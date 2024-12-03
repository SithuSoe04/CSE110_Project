import { Database } from "sqlite";
import { Request, Response } from "express";
import { getAllFriendRequests, acceptFriendRequest, declineFriendRequest, searchUsers, sendRequests, getFriendsInterestedEvents, updateFriendsInterestedEvents } from "./friends-utils";

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

  app.post("/friends/requests/:id/accept", (req: Request, res: Response) => {
    acceptFriendRequest(req, res, db);
  });
  
  app.delete("/friends/requests/:id", (req: Request, res: Response) => {
    declineFriendRequest(req, res, db);
  });

  app.get("/users/search", async (req: Request, res: Response) => {
    searchUsers(req, res, db);
  });
  
  app.post("/friends/requests", async (req: Request, res: Response) => {
    sendRequests(req, res, db);
  });

  app.post("/friends/interested-events/update", async (req: Request, res: Response) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request body." });
    }
  
    try {
      await updateFriendsInterestedEvents(userId, db);
      res.status(200).json({ message: "Friends' interested events updated successfully." });
    } catch (err) {
      console.error("Error updating friends' interested events:", err);
      res.status(500).json({ error: "Failed to update friends' interested events." });
    }
  });
  
  app.get("/friends/interested-events/:userId", async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request parameters." });
    }
  
    try {
      await getFriendsInterestedEvents(req, res, db);
    } catch (err) {
      console.error("Error fetching friends' interested events:", err);
      res.status(500).json({ error: "Failed to fetch friends' interested events." });
    }
  });   
}  