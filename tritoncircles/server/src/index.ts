import { Response } from "express";
import { budget } from "./constants";
import initDB from "./createTable";
import { createEventEndpoints } from "./events/events-endpoints";

//added
import { seedEvents } from './events/testEvents';

const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(cors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true
  }));
app.use(express.json());

// Start the server
app.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});

// Initialize the database and start the server
(async () => {
 const db = await initDB();

//added
// Seed test events
await seedEvents(db);

 // Root endpoint to get test if the server is running
 app.get("/", (res: Response) => {
   res.send({ "data": "Hello, TypeScript Express!" });
   res.status(200);
 });

 createEventEndpoints(app, db);
})();

