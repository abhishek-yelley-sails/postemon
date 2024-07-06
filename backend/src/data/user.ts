import { NotFoundError } from "../util/error.js";
import { readData, writeData } from "./util.js";
import { v4 } from "uuid";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;


export interface User {
  email: string,
  id: string,
}

interface RetrievedUser {
  email: string,
  password: string,
  id: string,
}

export interface SignupInfo {
  email: string,
  password: string
}

export async function getUser(email: string) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError('Could not find any users.');
  }

  const user: RetrievedUser = storedData.users.find((item: RetrievedUser) => item.email === email);
  if (!user) {
    throw new NotFoundError('Could not find user for email ' + email);
  }

  return user;
}

export async function addUser(data: SignupInfo): Promise<User> {
  const storedData = await readData();
  const userId = v4();
  const hashedPw = await hash(data.password, 12);
  if (!storedData.users) {
    storedData.users = [];
  }
  storedData.users.push({ ...data, password: hashedPw, id: userId });
  await writeData(storedData);
  return { id: userId, email: data.email };
}