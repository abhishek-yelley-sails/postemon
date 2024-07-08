import { Router } from "express";

import { TokenRequest } from "../util/auth.js";
import { getUserById } from "../data/user.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const user = await getUserById((req as TokenRequest).token.userId);
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;