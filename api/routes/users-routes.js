import { Router } from 'express';
import {getUserById} from '../controllers/users-controller.js';

export const usersRouter = Router();
usersRouter.get("/:id", getUserById);