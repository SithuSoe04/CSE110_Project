import { Database } from "sqlite";

export const seedEvents = async (db: Database) => {
    const sampleEvents = [
        {
            club_id: 1,
            title: "React Basics",
            date: "2024-11-15 15:00:00",
            room: "CSE Building 2154",
            incentives: "Free pizza"
        },
        {
            club_id: 1,
            title: "Coding Workshop",
            date: "2024-11-20 16:00:00",
            room: "Price Center East",
            incentives: "Snacks provided"
        },
        {
            club_id: 2,
            title: "UCSD Wind Ensemble Concert",
            date: "2024-11-25 18:00:00",
            room: "Mandeville Auditorium",
            incentives: "Refreshments provided"
        },
        {
            club_id: 3,
            title: "Music Theory Workshop",
            date: "2024-11-30 14:00:00",
            room: "Conrad Prebys Music Center",
            incentives: "Free sheet music"
        }

    ];

    try {
        // clear existing test data
        await db.run('DELETE FROM events WHERE event_id > 0');
        
        // Insert sample events
        for (const event of sampleEvents) {
            await db.run(
                'INSERT INTO events (club_id, title, date, room, incentives) VALUES (?, ?, ?, ?, ?)',
                [event.club_id, event.title, event.date, event.room, event.incentives]
            );
        }
        
        console.log('Sample events seeded successfully');
    } catch (error) {
        console.error('Error seeding events:', error);
        throw error;
    }
};