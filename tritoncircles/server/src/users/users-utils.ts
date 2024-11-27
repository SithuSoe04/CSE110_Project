import { Database } from "sqlite";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function getAllUsers(req: Request, res: Response, db: Database) {
    try {
        const users = await db.all('SELECT * FROM users;'); // Fetch all users
        res.status(200).json(users); // Send users as JSON response
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'Failed to fetch users' });
    }
}

export async function userSignUp(req: Request, res: Response, db: Database) {
    const {name, email, password} = req.body as {name: string, email: string, password: string};
    if (!name || !email || !password){
        return res.status(400).send({ error: "Missing required fields" });
    }
    try {
        const existingUser = await db.get('SELECT * from users where email = ?', [email])
        if (existingUser) {
            return res.status(409).send({ error: "Email is already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?);', [name, email, hashedPassword]);
        const newUser = await db.get('SELECT user_id FROM users WHERE email = ?', [email]);
        res.status(201).json({ message: "User registered successfully", user_id: newUser.user_id });
    } catch (error) {
        return res.status(500).send({error: `Error registering user: ${error}`});
    };
}

export async function updateUserProfile(req: Request, res: Response, db: Database){
    const { user_id, college, major, year, minor} = req.body as {user_id: number, college?: string, major?: string, year?: string, minor?: string};
    console.log('Received updateUserProfile request:', req.body);
    if(!user_id){
        return res.status(400).send({error:"Missing required user ID"});
    }
    try{
        const result = await db.run('UPDATE users SET college = ?, major = ?, year = ?, minor = ? WHERE user_id = ?;', [college || null, major || null, year || null, minor || null, user_id]);
        console.log('Update result:', result);
        res.status(200).send({message:"Profile updated successfully"});
    }
    catch(error){
        console.error('Error updating profile:', error);
        res.status(500).send({error: `Error updating profile: ${error}`});
    }
}

export async function userLogIn(req: Request, res: Response, db: Database) {
    const {email, password} = req.body as {email: string, password: string};
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
            res.status(200).send({message: "Logged in successfully", user_id: currentUser.user_id});
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

export async function updatePrivacy(req: Request, res: Response, db: Database) {
    const { user_id, newPrivacyState } = req.body as { user_id: number, newPrivacyState: number };

    if (!user_id || typeof newPrivacyState !== 'number') {
        return res.status(400).send({ error: "Missing required fields" });
    }

    try {
        const result = await db.run('UPDATE users SET private = ? WHERE user_id = ?;', [newPrivacyState, user_id]);
        console.log('Update result:', result)
        res.status(200).send({ message: "Privacy setting updated successfully" });
    } catch (error) {
        console.error('Error updating privacy setting:', error);
        return res.status(500).send({ error: `Error updating privacy setting: ${error}` });
    }
}

export async function getUser(req: Request, res: Response, db: Database) {
    const {user_id} = req.query;
    try {
        const users = await db.get('SELECT * FROM users where user_id = ?;', [user_id]); 
        res.status(200).json(users); 
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'Failed to fetch users' });
    }
}