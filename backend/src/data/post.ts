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

export interface EditPostData {
  title?: string,
  description?: string,
}

export async function createPost(data: MakePostData) {
  const storedData = await readData();
  const postId = v4();
  if (!storedData.posts) {
    storedData.posts = [];
  }
  const post: Post = { ...data, postId };
  storedData.posts = [post, ...storedData.posts];
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

export async function getPost(postId: string) {
  const storedData = await readData();
  if (!storedData.posts || storedData.posts.length === 0) {
    throw new NotFoundError("No posts found");
  }
  const post: Post = storedData.posts.find((item: Post) => item.postId === postId);
  if (!post) {
    throw new NotFoundError("Post not found");
  }
  return post;
}

export async function editPost(postId: string, data: EditPostData) {
  const oldPost = await getPost(postId);
  const editedPost = { ...oldPost, ...data, postId: oldPost.postId };
  const storedData = await readData();
  storedData.posts = [editedPost, ...storedData.posts];
  await writeData(storedData);
  return editedPost;
}