import { v4 } from "uuid";
import { readData, writeData } from "./util.js";
import { NotFoundError } from "../util/error.js";

export interface MakePostData {
  userId: String,
  title: String,
  description: String,
}
export interface Post extends MakePostData {
  postId: string
}

export async function makePost(data: MakePostData) {
  const storedData = await readData();
  const postId = v4();
  if (!storedData.posts) {
    storedData.posts = [];
  }
  const post: Post = { ...data, postId };
  storedData.posts.push(post);
  await writeData(storedData);
  return post;
}

export async function getAllPosts() {
  const storedData = await readData();
  if (!storedData.posts || storedData.posts.length === 0) {
    throw new NotFoundError("No posts found");
  }
  return storedData.posts;
}