import { Router } from "express";
import { addUser, getUser, SignupInfo } from "../data/user.js";
import { isValidEmail, isValidText } from "../util/validation.js";
import { createJSONToken, isValidPassword } from "../util/auth.js";

const router = Router();


router.post('/signup', async (req, res, next) => {
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


router.post('/login', async (req, res) => {
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

export default router;