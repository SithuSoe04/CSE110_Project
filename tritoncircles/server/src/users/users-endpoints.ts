import { Database } from "sqlite";
import { getAllUsers, userLogIn, updateUserProfile, userSignUp, userFavoriteClub, userFavoriteEvent, userUnfavoriteClub, userUnfavoriteEvent, updatePrivacy, getUser} from "./users-utils";
import { Request, Response } from "express";

export function createUserEndpoints(app: any, db: Database) {

  app.get("/users", (req: Request, res: Response) => {

    getAllUsers(req, res, db);

  });

  app.post("/signup", (req: Request, res: Response) => {
    console.log("Received signup request with body:", req.body);
    userSignUp(req, res, db);
  });

  app.post("/updateUserInfo", (req: Request, res: Response) => {
    console.log("Received update user info request with body:", req.body);
    updateUserProfile(req, res, db);

  });

  app.post("/login", (req: Request, res: Response) => {

    userLogIn(req, res, db);

  });

  app.post("/favoriteevent", (req: Request, res: Response) => {

    userFavoriteEvent(req, res, db);

  });

  app.delete("/unfavoriteevent", (req: Request, res: Response) => {

    userUnfavoriteEvent(req, res, db);

  });

  app.post("/favoriteclub", (req: Request, res: Response) => {
    
    userFavoriteClub(req, res, db);

  });

  app.delete("/unfavoriteclub", (req: Request, res: Response) => {

    userUnfavoriteClub(req, res, db);

  });

  app.put("/updateprivacy", (req: Request, res: Response) => {

    updatePrivacy(req, res, db);

  });

  app.get("/user", (req: Request, res: Response) => {

    getUser(req, res, db);

  });
}
