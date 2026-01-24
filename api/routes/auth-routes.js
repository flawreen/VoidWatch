import { Router } from 'express';
import {verify, logout} from '../controllers/auth-controller.js';

export const authRouter = Router();
authRouter.post("/verify", verify);
authRouter.post("/logout", logout);