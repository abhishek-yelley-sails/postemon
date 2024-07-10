import { v4 } from "uuid";
import { readData, writeData } from "./util.js";
import { NotFoundError, NotAuthError, MissingData } from "../util/error.js";

export interface MakePostData {
  userId: string,
  title: string,
  description: string,
  time: string,
}
export interface Post extends MakePostData {
  postId: string
}

export interface EditPostData {
  title?: string,
  description?: string,
}

export async function createPost(data: MakePostData) {
  if (!data.title) {
    throw new MissingData("Title is required");
  }
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

export async function editPost(postId: string, data: EditPostData, reqUserId: string) {
  const oldPost = await getPost(postId);
  if (oldPost.userId !== reqUserId) {
    throw new NotAuthError("Only original author can edit post");
  }
  const editedPost = {
    ...oldPost,
    title: data.title ? data.title : oldPost.title,
    description: data.description ? data.description : oldPost.description,
  };
  const storedData = await readData();
  if (!storedData.posts) {
    storedData.posts = [];
  }
  storedData.posts = storedData.posts.filter((item: Post) => item.postId !== postId);
  storedData.posts = [editedPost, ...storedData.posts];
  await writeData(storedData);
  return editedPost;
}