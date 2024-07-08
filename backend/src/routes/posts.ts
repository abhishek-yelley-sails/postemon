import { Router } from "express";

import { TokenRequest } from "../util/auth.js";
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

router.post("/create", async (req, res) => {
  const userId = (req as TokenRequest).token.userId;
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
    const postId = req.params.postId;
    const userId: string = (req as any).token?.userId;
    const editedPost = await editPost(postId, req.body, userId);
    return res.json(editedPost);
  } catch (error) {
    next(error);
  }
});

export default router;