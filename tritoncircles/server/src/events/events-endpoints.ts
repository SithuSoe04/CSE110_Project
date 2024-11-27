import { Database } from "sqlite";
import { createEvent, deleteEvent, getAllClubEvents, getUserUpcomingEvents, getUserFavoriteEvents, getUserNonFavoriteEvents} from "./events-utils";
import { Request, Response } from "express";

export function createEventEndpoints(app: any, db: Database) {
  app.post("/events", (req: Request, res: Response) => {

    createEvent(req, res, db);

  });
  app.delete("/events/:id", (req: Request, res: Response) => {

    deleteEvent(req, res, db);

  });
  app.get("/events", (req: Request, res: Response) => {
    
    getAllClubEvents(req, res, db);

  });

  app.get("/upcomingevents", (req: Request, res: Response) => {

    getUserUpcomingEvents(req, res, db);
    
  });

  app.get("/nonfavoriteevents", (req: Request, res: Response) => {

    getUserNonFavoriteEvents(req, res, db);
    
  });

  app.get("/favoriteevents", (req: Request, res: Response) => {

    getUserFavoriteEvents(req, res, db);

  });
}
