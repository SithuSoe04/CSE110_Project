import { Database } from "sqlite";
import { Request, Response } from "express";
import { getAllFriendRequests, acceptFriendRequest, declineFriendRequest, getFriendsInterestedEvents, searchUsers, sendRequests } from "./friends-utils";

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

  app.get("/friends/interested-events", async (req: Request, res: Response) => {
    getFriendsInterestedEvents(req, res, db);
  });

  app.get("/users/search", async (req: Request, res: Response) => {
    searchUsers(req, res, db);
  });
  
  app.post("/friends/requests", async (req: Request, res: Response) => {
    sendRequests(req, res, db);
  });
  
}  