import { Database } from "sqlite";
import { createRecruitment, deleteRecruitment, getUserRecruitment } from "./recruitment-utils";
import { Request, Response } from "express";

export function createRecruitmentEndpoints(app: any, db: Database) {
  app.post("/recruitments", (req: Request, res: Response) => {

    createRecruitment(req, res, db);

  });
  app.delete("/recruitment/:id", (req: Request, res: Response) => {

    deleteRecruitment(req, res, db);

  });
  app.get("/recruitments", (req: Request, res: Response) => {
    
    getUserRecruitment(req, res, db);

  });
}
