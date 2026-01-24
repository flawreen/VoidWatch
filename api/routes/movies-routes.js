import { Router } from 'express';
import {getMovieById, getAllMovies} from '../controllers/movies-controller.js';

export const moviesRouter = Router();
moviesRouter.get("/:id", getMovieById);
moviesRouter.get("/", getAllMovies);