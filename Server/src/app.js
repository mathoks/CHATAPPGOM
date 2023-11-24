import express from "express";
import bodyParser from "body-parser";
import expressSanitizer from "express-sanitizer";
import { expressMiddleware } from "@apollo/server/express4";

import cors from "cors";

const app = express();

app.use(
  "/",
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
  }),

  

  expressSanitizer(),

  bodyParser.json()
);

export default app;
