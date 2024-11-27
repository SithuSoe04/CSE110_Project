import { Database } from "sqlite";
import { Request, Response } from "express";

export async function createRecruitment(req: Request, res: Response, db: Database) {
    const { club_id, title, date_posted, deadline, application_link } = req.body as {
        club_id: number;
        title: string;
        date_posted?: string; // Optional, defaults to the current timestamp
        deadline: string;
        application_link: string;
    };

    if (!club_id || !title || !deadline || !application_link) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    try {
        await db.run(`INSERT INTO recruitment (club_id, title, date_posted, deadline, application_link) VALUES (?, ?, ?, ?, ?);`, [club_id, title, date_posted || new Date().toISOString(), deadline, application_link]);
        res.status(201).send({ club_id, title, date_posted, deadline, application_link });
    } catch (error) {
        res.status(500).send({ error: `Recruitment could not be created: ${error}` });
    }
}
 
export async function deleteRecruitment(req: Request, res: Response, db: Database) {
    const { recruitment_id } = req.params;
    if (!recruitment_id) {
        return res.status(400).send({ error: "Missing required field: recruitment_id" });
    }
    try {
        const recruitment = await db.get(
            `SELECT recruitment_id FROM recruitment WHERE recruitment_id = ?`,
            [recruitment_id]
        );
        if (!recruitment) {
            return res.status(404).send({ error: "Recruitment not found" });
        }
        await db.run(`DELETE FROM recruitment WHERE recruitment_id = ?`, [recruitment_id]);
        res.status(200).send({ message: "Recruitment deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: `Error deleting recruitment: ${error}` });
    }
}

export async function getUserRecruitment(req: Request, res: Response, db: Database) {
    const { user_id } = req.query;
    try {
        const userRecruitment = await db.all(`SELECT recruitment.*, clubs.name AS club_name FROM recruitment INNER JOIN clubs ON recruitment.club_id = clubs.club_id INNER JOIN club_favorites ON recruitment.club_id = club_favorites.club_id WHERE club_favorites.user_id = ?`, [user_id]);
        res.status(200).send({"data": userRecruitment});
    }
    catch (error){
        res.status(500).send({ error: `Error getting recruitment posts: , + ${error}` });
    }
}
