import { Database } from "sqlite";
import { getAllUsers, userLogIn, updateUserProfile, updateUserSecurity, finalizeUser, userSignUp, verifySecurity, updatePassword, userFavoriteClub, userFavoriteEvent, userUnfavoriteClub, userUnfavoriteEvent, updatePrivacy, getUser} from "./users-utils";
import { NextFunction, Request, Response } from "express";
import multer from 'multer';
import path from 'path';

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

  app.post("/security", (req:Request, res:Response) => {
    console.log("Received security update request:", req.body);
    updateUserSecurity(req, res, db);
  });

  app.post("/finalizeSignup", (req:Request, res:Response) => {
    console.log("Received finalize sign up request:", req.body);
    finalizeUser(req, res, db);
  });

  app.post("/login", async (req: Request, res: Response) => {

    userLogIn(req, res, db);

  });

  app.post("/verifySecurity", (req:Request, res:Response) => {
    verifySecurity(req, res, db);
  });

  app.post("/updatePassword", (req:Request, res:Response) => {
    updatePassword(req, res, db);
  });

  app.post("/updateBio", async (req:Request, res:Response) => {
    const {user_id, bio} = req.body;
    console.log("Received data:", {user_id, bio});
    try{
      const result = await db.run("UPDATE users SET bio = ? WHERE user_id = ?", [bio, user_id]);
      console.log('Database operation result:', result);
      if(result.changes){
        res.status(200).send({message: "Bio updated successfully"});
      } else{
        throw new Error ("No changes made");
      }
    }catch (error){
      console.error('Database error during bio update:', error);
      res.status(500).send({error: (error as Error).message});
    }
  });

  app.post("/addInterest", async(req:Request, res:Response) => {
    const {user_id, interest} = req.body;
    console.log("Received data:", {user_id, interest});
    try{
      await db.run ("INSERT INTO user_interests (user_id, interest) VALUES (?, ?)", [user_id, interest]);
      res.status(200).send({message: "Interest added successfully"});
    } catch(error){
      res.status(500).send({error: "Failed to add interest"});
    }
  });

  app.delete("/removeInterest", async (req:Request, res:Response) => {
    const { id } = req.body;
    console.log("Received data:", {id});
    try{
      await db.run ("DELETE FROM user_interests WHERE id = ?", [id]);
      res.status(200).send({message: "Interest removed successfully"});
    } catch(error){
      res.status(500).send({error: "Failed to remove interest"});
    }
  });

  app.get("/getInterests", async(req:Request, res:Response) => {
    const {user_id} = req.query;
    try{
      const interests = await db.all("SELECT id, interest FROM user_interests WHERE user_id = ?", [user_id]);
      res.status(200).json(interests);
    }catch(error){
      res.status(500).send({error: "Failed to fetch interests"});
    }
  });

  const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb){
      const user_id = req.body.user_id || 'default';
      const extension = path.extname(file.originalname);
      cb(null, 'profile-'+ user_id + '-' + Date.now() + extension);
    }
  });
  const express = require('express');
  const upload = multer({storage: storage});
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use('/uploads', express.static('uploads'));

  app.post('/uploadProfilePic', upload.single('profileImage'), (req:Request, res:Response) => {
    console.log(req.body);
    console.log(req.file);
    if(req.file){
      res.json({
        message: 'File uploaded successfully', 
        filepath: req.file.path
      });
    } else {
      res.status(400).send('No file uploaded');
    }
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
