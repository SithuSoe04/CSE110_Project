import { Database } from "sqlite";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function userSignUp(req: Request, res: Response, db: Database) {
    const {user_id, name, email, password, college, major, interests} = req.body as {user_id: number, name: string, email: string, password: string, college?: string, major?: string, interests?: string}
    if (!user_id || !name || !email || !password){
        return res.status(400).send({ error: "Missing required fields" });
    }
    try {
        const existingUser = await db.get('SELECT * from users where email = ?', [email])
        if (existingUser) {
            return res.status(409).send({ error: "Email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (user_id, name, email, password, college, major, interests) VALUES (?, ?, ?, ?, ?, ?, ?);', [user_id, name, email, hashedPassword, college || "", major || "", interests || ""]);
        res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).send({error: `Error registering user: ${error}`});
    };
}

export async function userLogIn(req: Request, res: Response, db: Database) {
    const {email, password} = req.body as {email: string, password: string}
    if (!email || !password) {
        return res.status(400).send({ error: "Missing required fields" });
    }
    try {
        const currentUser = await db.get('SELECT * from users where email = ?', [email]);
        if (!currentUser){
            res.status(401).send({messsage: 'Username or password does not match'})
        }
        const match = await bcrypt.compare(password, currentUser.password);
        if (match) {
            res.status(200).send({message: "Logged in successfully"});
        } else {
            res.status(401).send({messsage: 'Username or password does not match'})
        }
    }
    catch (error){
        return res.status(500).send({error: `Log in unsuccessful: ${error}`});
    }
}

export async function userFavoriteEvent(req: Request, res: Response, db: Database) {
    const {user_id, event_id} = req.body as {user_id: number, event_id: number}
    if (!user_id || !event_id){
        return res.status(400).send({ error: "Missing required fields" });
    }
    try {
        await db.run('INSERT INTO event_favorites (user_id, event_id) VALUES (?, ?);', [user_id, event_id]);
        res.status(200).send({ message: "Event favorited successfully", user_id, event_id });
    } catch (error) {
        return res.status(400).send({ error: `Event could not be favorited, + ${error}` });
    };
}

export async function userUnfavoriteEvent(req: Request, res: Response, db: Database) {
    const {user_id, event_id} = req.body as {user_id: number, event_id: number}
    if (!user_id || !event_id){
        return res.status(400).send({ error: "Missing required fields" });
    }
    try {
        await db.run('DELETE FROM event_favorites WHERE user_id = ? AND event_id = ?;', [user_id, event_id]);
        res.status(200).send({ message: "Event unfavorited successfully", user_id, event_id });
    } catch (error) {
        return res.status(400).send({ error: `Event could not be unfavorited, + ${error}` });
    };
}

export async function userFavoriteClub(req: Request, res: Response, db: Database) {
    const {user_id, club_id} = req.body as {user_id: number, club_id: number}
    if (!user_id || !club_id){
        return res.status(400).send({ error: "Missing required fields" });
    }
    try {
        await db.run('INSERT INTO club_favorites (user_id, club_id) VALUES (?, ?);', [user_id, club_id]);
        res.status(200).send({ message: "Club favorited successfully", user_id, club_id });
    } catch (error) {
        return res.status(400).send({ error: `Club could not be favorited, + ${error}` });
    };

}

export async function userUnfavoriteClub(req: Request, res: Response, db: Database) {
    const {user_id, club_id} = req.body as {user_id: number, club_id: number}
    if (!user_id || !club_id){
        return res.status(400).send({ error: "Missing required fields" });
    }
    try {
        await db.run('DELETE FROM club_favorites WHERE user_id = ? AND club_id = ?;', [user_id, club_id]);
        res.status(200).send({ message: "Club unfavorited successfully", user_id, club_id });
    } catch (error) {
        return res.status(400).send({ error: `Club could not be unfavorited, + ${error}` });
    };
}

