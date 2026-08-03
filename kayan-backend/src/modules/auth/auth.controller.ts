import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}