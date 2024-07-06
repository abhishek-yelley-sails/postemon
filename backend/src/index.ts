import express from "express";
import cors from "cors";
import { checkAuthMiddleware as checkAuth, createJSONToken, isValidPassword } from "./util/auth.js";
import { isValidEmail, isValidText } from "./util/validation.js";
import { getUser, addUser } from "./data/user.js";

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { SignupInfo } from "./data/user.js"
import { getAllPosts, makePost } from "./data/post.js";

import { config } from "dotenv";
config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', async (req, res, next) => {
  const data: SignupInfo = req.body;
  let errors: {
    email?: string,
    password?: string,
  } = {};

  if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email.';
  } else {
    try {
      const existingUser = await getUser(data.email);
      if (existingUser) {
        errors.email = 'Email exists already.';
      }
    } catch (error) { }
  }

  if (!isValidText(data.password, 6)) {
    errors.password = 'Invalid password. Must be at least 6 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'User signup failed due to validation errors.',
      errors,
    });
  }

  try {
    const createdUser = await addUser(data);
    const authToken = createJSONToken(createdUser.id);
    res
      .status(201)
      .json({ message: 'User created.', user: createdUser, token: authToken });
  } catch (error) {
    next(error);
  }
});
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await getUser(email);
    const pwIsValid = await isValidPassword(password, user.password);
    if (!pwIsValid) {
      return res.status(422).json({
        message: 'Invalid credentials.',
        errors: { credentials: 'Invalid email or password entered.' },
      });
    }

    const token = createJSONToken(user.id);
    return res.json({ token });
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }

});

app.use(checkAuth);
app.get("/all-posts", async (req, res, next) => {
  try {
    const data = await getAllPosts();
    return res.json(data);
  } catch (error) {
    next(error);
  }
});
app.post("/make-post", async (req: Request & { token?: JwtPayload }, res) => {
  const userId = req.token?.userId;
  const title = req.body.title;
  const description = req.body.description;
  const post = await makePost({ userId, title, description });
  res.json(post);
});


app.use((error: Error & { message: string, status: number }, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));