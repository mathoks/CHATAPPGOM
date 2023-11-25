import express from "express";
import bodyParser from "body-parser";
import expressSanitizer from "express-sanitizer";
import { expressMiddleware } from "@apollo/server/express4";

import cors from "cors";

const app = express();

app.use(
  "/",
  cors({
    origin: ["https://chat-app-go-apc4.onrender.com/", "https://splendorous-faun-aaaf25.netlify.app"],
    credentials: true,
  }),

  

  expressSanitizer(),

  bodyParser.json()
);

export default app;
