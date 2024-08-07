import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { NotAuthError } from "./error.js";

const { sign, verify } = jwt;
const { compare } = bcrypt;

export interface JwtPayload {
  userId: string,
}

export interface TokenRequest extends Request {
  token: JwtPayload,
}

export function validateJSONToken(token: string): JwtPayload {
  if (process.env.JWT_KEY)
    return verify(token, process.env.JWT_KEY) as JwtPayload;
  throw new Error("Missing JWT_KEY!");
}

export function isValidPassword(password: string, storedPassword: string) {
  return compare(password, storedPassword);
}

export function createJSONToken(userId: string) {
  if (process.env.JWT_KEY)
    return sign({ userId }, process.env.JWT_KEY, { expiresIn: '1h' });
  throw new Error("Missing JWT_KEY!");
}

// function isValidPassword(password, storedPassword) {
//   return compare(password, storedPassword);
// }

export function checkAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    console.log('NOT AUTH. AUTH HEADER MISSING.');
    return next(new NotAuthError('Not authenticated.'));
  }
  const authFragments = req.headers.authorization.split(' ');

  if (authFragments.length !== 2) {
    console.log('NOT AUTH. AUTH HEADER INVALID.');
    return next(new NotAuthError('Not authenticated.'));
  }
  const authToken = authFragments[1];
  try {
    const validatedToken = validateJSONToken(authToken);
    (req as TokenRequest).token = validatedToken;
  } catch (error) {
    console.log('NOT AUTH. TOKEN INVALID.');
    return next(new NotAuthError('Not authenticated.'));
  }
  next();
}