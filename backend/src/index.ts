import express from "express";
import cors from "cors";

import { checkAuthMiddleware as checkAuth } from "./util/auth.js";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";

import { Request, Response, NextFunction } from 'express';

import { config } from "dotenv";
config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(authRouter);

app.use(checkAuth);

app.use("/posts", postsRouter);

app.use("/users", usersRouter);

app.use((error: Error & { message: string, status: number }, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));