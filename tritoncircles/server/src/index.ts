import { Response } from "express";
import { budget } from "./constants";
import initDB from "./createTable";
import { createEventEndpoints } from "./events/events-endpoints";

const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

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
 app.get("/", (res: Response) => {
   res.send({ "data": "Hello, TypeScript Express!" });
   res.status(200);
 });

 createEventEndpoints(app, db);
})();

