import { Request, Response } from "express";
import { budget } from "./constants";
import initDB from "./createTable";
import { createEventEndpoints } from "./events/events-endpoints";
import { createUserEndpoints } from "./users/users-endpoints";

const express = require("express");
const cors = require("cors");

const app = express();
const port = 8102;

app.use(cors());
app.use(express.json());

// Start the server
app.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});

// Initialize the database and start the server
(async () => {
 const db = await initDB();

 // Root endpoint to get test if the server is running
 app.get("/", (req: Request, res: Response) => {
   res.status(200).send({ "data": "Hello, TypeScript Express!" });
 });

 createUserEndpoints(app, db);
 createEventEndpoints(app, db);
})();

