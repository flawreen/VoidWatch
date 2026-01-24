import { Router } from 'express';
import * as reviewsController from '../controllers/reviews-controller.js';

export const reviewsRouter = Router();
reviewsRouter.get("/:id", reviewsController.getReviewsByMovie);
reviewsRouter.post("/", reviewsController.addReview);
reviewsRouter.put("/:id", reviewsController.editReview);
reviewsRouter.delete("/:id", reviewsController.deleteReview);
