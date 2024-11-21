import { Database } from "sqlite";
import { Request, Response } from "express";
//added import
import { seedEvents } from './testEvents';

// Add this new function
export async function initializeTestData(db: Database) {
    try {
        await seedEvents(db);
        return { success: true, message: 'Test data initialized successfully' };
    } catch (error) {
        return { success: false, message: `Error initializing test data: ${error}` };
    }
}


export async function createEvent(req: Request, res: Response, db: Database) {
    const {club_id, title, date, room, incentives} = req.body as {club_id: number, title: string, date: string, room: string, incentives?: string}
    if (!club_id || !title || !date || !room){
        return res.status(400).send({ error: "Missing required fields" });
    }
    try {
        await db.run('INSERT INTO events (club_id, title, date, room, incentives) VALUES (?, ?, ?, ?, ?);', [club_id, title, date, room, incentives || ""]);
    } catch (error) {
        return res.status(400).send({ error: `Event could not be created, + ${error}` });
    };
    res.status(201).send({ club_id, title, date, room, incentives });
}
 
export async function deleteEvent(req: Request, res: Response, db: Database) {
    const { event_id } = req.params; 
    if (!event_id) {
        return res.status(400).send({ error: "Missing required field: event_id" });
    }

    try {
        const event = await db.get(`SELECT event_id FROM events WHERE event_id = ?`, [event_id]);
        if (!event) {
            return res.status(404).send({ error: "Event not found" });
        }
        await db.run(`DELETE FROM events WHERE event_id = ?`, [event_id]);
        res.status(200).send({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: `Error deleting event: ${error}` });
    }
}

export async function getAllClubEvents(req: Request, res: Response, db: Database) {
    try {
        const events = await db.all('SELECT * FROM events');
        res.status(200).send({"data": events });
    } catch (error) {
        res.status(500).send({ error: `Error getting events: , + ${error}` });
    }
}

export async function getUserUpcomingEvents(req: Request, res: Response, db: Database) {
    const { user_id } = req.query;
    try {
        const userUpcomingEvents = await db.all(`SELECT events.* FROM events INNER JOIN club_favorites ON events.club_id = club_favorites.club_id WHERE club_favorites.user_id = ?`, [user_id]);
        res.status(200).send({"data": userUpcomingEvents});
    }
    catch (error){
        res.status(500).send({ error: `Error getting user upcoming events: , + ${error}` });
    }
}

export async function getUserFavoriteEvents(req: Request, res: Response, db: Database) {
    const { user_id } = req.query;
    try {
        const userFavoriteEvents = await db.all(`SELECT events.* FROM events INNER JOIN event_favorites ON events.event_id = event_favorites.event_id WHERE event_favorites.user_id = ?`, [user_id]);
        res.status(200).send({"data": userFavoriteEvents});
        console.log(userFavoriteEvents);
    }
    catch (error){
        res.status(500).send({ error: `Error getting user upcoming events: , + ${error}` });
    }
}