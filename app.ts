import mongoose from "mongoose";
import TrackSchema from "./models/track.schema";
import { Request, Response } from "express";
import cors from "cors";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fsMiddleware } from "./middlewares/fs.middleware";
import { validationMiddleware } from "./middlewares/validation.middleware";

dotenv.config();

const EventModel = mongoose.model("tracks", TrackSchema);
const client = express();
const server = express();

const CLIENT_PORT = process.env.CLIENT_PORT || 50000;
const SERVER_PORT = process.env.SERVER_PORT || 8888;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/app";

server.use(bodyParser.json());
server.use(cors({ preflightContinue: false, optionsSuccessStatus: 200 }));
server.use(fsMiddleware);
server.use(express.static(path.join(__dirname, "./src")));

server.post("/track", validationMiddleware, async (req: Request, res: Response) => {
  const eventPayload = req.body;

  try {
    await EventModel.insertMany(eventPayload);
    console.log("Events received");
    res.status(200).send("Events received");
  } catch (error) {
    console.error("Error inserting events:", error);
    res.status(500).send("Error inserting events");
  }
});

client.get(["/", "/1.html", "/2.html", "/3.html"], (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./src/index.html"));
});

async function initializeServers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    client.listen(CLIENT_PORT, () => {
      console.log(`Client is running on port ${CLIENT_PORT}`);
    });

    server.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Server Error:", error.message);
    } else {
      console.log("Unknown error occurred.");
    }
    process.exit(1);
  }
}

initializeServers();