import { Router } from "express";
import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken";

import { getAllPosts, createPost, getPost, editPost } from "../data/post.js";

const router = Router();

router.get("/all", async (req, res, next) => {
  try {
    const data = await getAllPosts();
    return res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req: Request & { token?: JwtPayload }, res) => {
  const userId = req.token?.userId;
  const title = req.body.title;
  const description = req.body.description;
  const post = await createPost({ userId, title, description });
  res.json(post);
});

router.get("/:postId", async (req, res, next) => {
  try {
    const post = await getPost(req.params.postId);
    return res.json(post);
  } catch (error) {
    next(error);
  }
});

router.post("/edit/:postId", async (req, res, next) => {
  try {
    const editedPost = await editPost(req.params.postId, req.body);
    return res.json(editedPost);
  } catch (error) {
    next(error);
  }
});

export default router;