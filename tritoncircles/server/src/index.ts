import express, { Request, Response } from "express";
import initDB from "./createTable";
import { createUserEndpoints } from "./users/users-endpoints";
import { createEventEndpoints } from './events/events-endpoints';
import { createFriendsEndpoints } from "./friends/friends-endpoints";
import { createRecruitmentEndpoints } from "./recruitment/recruitment-endpoints";


const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

interface FavoriteRequest {
  userId: number;
  clubId: number;
}

// Initialize database and start server
(async () => {
  try {
    const db = await initDB();
    console.log("Database initialized successfully");

    // Root endpoint to get test if the server is running
    app.get("/", (req: Request, res: Response) => {
      res.send({ "data": "Hello, TypeScript Express!" });
      res.status(200);
    });

    // Club endpoints
    app.get("/api/clubs", async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = 1;
        
        const clubs = await db.all(`
          SELECT 
            c.*,
            CASE WHEN cf.user_id IS NOT NULL THEN 1 ELSE 0 END as favorite
          FROM clubs c
          LEFT JOIN club_favorites cf 
            ON c.club_id = cf.club_id 
            AND cf.user_id = ?
        `, [userId]);
        
        console.log("Fetched clubs:", clubs);
        res.json({ clubs });
      } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).json({ error: "Failed to fetch clubs" });
      }
    });

    app.get("/api/clubs/favorites", async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = 1; // Default user ID for testing
        
        const favorites = await db.all(`
          SELECT 
            c.*,
            1 as favorite
          FROM clubs c
          INNER JOIN club_favorites cf 
            ON c.club_id = cf.club_id 
          WHERE cf.user_id = ?
        `, [userId]);
        
        console.log("Fetched favorites:", favorites);
        res.json({ favorites });
      } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ error: "Failed to fetch favorites" });
      }
    });

    app.post("/api/clubs/favorite", async (req: Request, res: Response): Promise<void> => {
      try {
        console.log("Received favorite toggle request");
        console.log("Request body:", req.body);
        const { userId, clubId } = req.body as FavoriteRequest;

        if (!userId || !clubId) {
          res.status(400).json({ 
            error: "Missing required fields",
            received: { userId, clubId }
          });
          return;
        }

        // Check if favorite exists
        const favorite = await db.get(
          "SELECT * FROM club_favorites WHERE user_id = ? AND club_id = ?",
          [userId, clubId]
        );
        console.log("Current favorite status:", favorite);

        if (favorite) {
          console.log("Removing favorite");
          await db.run(
            "DELETE FROM club_favorites WHERE user_id = ? AND club_id = ?",
            [userId, clubId]
          );
          res.json({ 
            success: true, 
            favorite: false,
            message: "Removed from favorites"
          });
        } else {
          console.log("Adding favorite");
          await db.run(
            "INSERT INTO club_favorites (user_id, club_id) VALUES (?, ?)",
            [userId, clubId]
          );
          res.json({ 
            success: true, 
            favorite: true,
            message: "Added to favorites"
          });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        res.status(500).json({ 
          error: "Failed to update favorite status",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });

    // Initialize other endpoints
    createEventEndpoints(app, db);
    createUserEndpoints(app, db);
    createFriendsEndpoints(app, db);
    createRecruitmentEndpoints(app, db);

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log("\nAvailable endpoints:");
      console.log("- GET  /api/clubs            (get all clubs)");
      console.log("- GET  /api/clubs/favorites  (get favorite clubs)");
      console.log("- POST /api/clubs/favorite   (toggle favorite status)");
    });

  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
})();

export default app;