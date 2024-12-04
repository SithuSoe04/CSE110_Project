import { Database } from "sqlite";
import { Request, Response } from "express";
import { getAllFriendRequests, acceptFriendRequest, declineFriendRequest, searchUsers, sendRequests, getFriendsInterestedEvents, updateFriendsInterestedEvents } from "./friends-utils";

export function createFriendsEndpoints(app: any, db: Database) {
  app.get("/friends/requests", async (req: Request, res: Response) => {
    getAllFriendRequests(req, res, db, req.query.user_id as string);
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
    getFriendsInterestedEvents(req, res, db);
  });   
}  