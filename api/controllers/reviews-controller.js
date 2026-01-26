import {db} from "../db.js";
import {logger} from "../config.js";
import Joi from "joi";
import { v4 as uuidv4 } from 'uuid';

export const getReviewsByMovie = async (req, res) => {
    try {
        const id = req.params.id;

        logger.info(`Checking if movie with id ${id} exists`);
        const movieRef = db.collection('movies').doc(id);
        const movieDoc = await movieRef.get();
        if (!movieDoc.exists) {
            return res.status(404).json({error: 'Movie not found.'});
        }

        const reviewsRef = await movieRef.collection('reviews').get();
        const reviews = reviewsRef.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return res.status(200).json(reviews);
    } catch (e) {
        logger.info(`Error retrieving reviews: ${e}`);
        return res.status(500).json({error: e.message});
    }
}

export const addReview = async (req, res) => {
    try {
        const authenticatedUserId = req.user.uid;
        const movieId = req.body.movieId;

        logger.info(`Checking if movie with id ${movieId} exists`);
        const movieRef = db.collection('movies').doc(movieId);
        const movieDoc = await movieRef.get();
        if (!movieDoc.exists) {
            return res.status(404).json({error: 'Movie not found.'});
        }

        logger.info(`Checking if user with id ${authenticatedUserId} exists`);
        const userRef = db.collection('users').doc(authenticatedUserId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({error: 'User not found.'});
        }

        logger.info('Validating review data...');
        const validation = Joi.object({
            title: Joi.string().min(3).max(200).required(),
            description: Joi.string().min(3).max(800).required(),
            rating: Joi.number().min(1).max(5).required(),
            movieId: Joi.required(),
        })
        const {error, validatedValues} = validation.validate(req.body);
        if (error) {
            return res.status(400).json({error: `Invalid data: ${error.message}`});
        }

        const reviewId = uuidv4();

        logger.info('Adding review to USERS collection');
        await db.collection('users').doc(authenticatedUserId).collection('reviews').doc(reviewId).set({
            title: req.body.title,
            description: req.body.description,
            rating: req.body.rating,
            createdAt: Date(),
            movieTitle: movieDoc.data().title,
            movieYear: movieDoc.data().year,
            movieId: movieId,
        });

        logger.info('Adding review to MOVIES collection');
        await db.collection('movies').doc(movieId).collection('reviews').doc(reviewId).set({
            title: req.body.title,
            description: req.body.description,
            rating: req.body.rating,
            createdAt: Date(),
            userName: userDoc.data().displayName,
            userId: authenticatedUserId,
        })

        res.status(200).json({message: 'Review added successfully.'});
    } catch (e) {
        logger.info(`Error adding review: ${e}`);
        return res.status(500).json({error: e.message});
    }
}

export const editReview = async (req, res) => {
    try {
        const id = req.params.id;
        const movieId = req.body.movieId;
        const authenticatedUserId = req.user.uid;

        logger.info(`Checking if review exists in movie with id ${movieId}`);
        const movieRef = db.collection('movies').doc(movieId).collection('reviews').doc(id);
        const movieDoc = await movieRef.get();
        if (!movieDoc.exists) {
            return res.status(404).json({error: `Review not found in movie with id ${movieId}`});
        }

        logger.info(`Checking if review exists in user with id ${authenticatedUserId}`);
        const userRef = db.collection('users').doc(authenticatedUserId).collection('reviews').doc(id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(403).json({error: `Review not owned by this user!`});
        }

        logger.info('Checking if user owns review');
        if (authenticatedUserId !== movieDoc.data().userId) {
            return res.status(403).json({error: 'Not allowed to edit review!'});
        }

        logger.info('Validating review data...');
        const validation = Joi.object({
            title: Joi.string().min(3).max(200).required(),
            description: Joi.string().min(3).max(800).required(),
            rating: Joi.number().min(1).max(5).required(),
            movieId: Joi.required(),
        })
        const {error, validatedValues} = validation.validate(req.body);
        if (error) {
            return res.status(400).json({error: `Invalid data: ${error.message}`});
        }

        logger.info(`Editing review ${id} in USERS collection`);
        await db.collection('users').doc(authenticatedUserId).collection('reviews').doc(id).update({
            title: req.body.title,
            description: req.body.description,
            rating: req.body.rating,
        });

        logger.info(`Editing review ${id} in MOVIES collection`);
        await db.collection('movies').doc(movieId).collection('reviews').doc(id).update({
            title: req.body.title,
            description: req.body.description,
            rating: req.body.rating,
        })

        res.status(200).json({message: `Review ${id} edited successfully.`});
    } catch (e) {
        logger.info(`Error editing review: ${e}`);
        return res.status(500).json({ error: e.message });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const id = req.params.id;
        const movieId = req.body.movieId;
        const authenticatedUserId = req.user.uid;

        logger.info(`Checking if review exists in movie with id ${movieId}`);
        const movieRef = db.collection('movies').doc(movieId).collection('reviews').doc(id);
        const movieDoc = await movieRef.get();
        if (!movieDoc.exists) {
            return res.status(404).json({error: `Review not found in movie with id ${movieId}`});
        }

        logger.info(`Checking if review exists in user with id ${authenticatedUserId}`);
        const userRef = db.collection('users').doc(authenticatedUserId).collection('reviews').doc(id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(403).json({error: `Review not owned by this user!`});
        }

        logger.info('Checking if user owns review');
        if (authenticatedUserId !== movieDoc.data().userId) {
            return res.status(403).json({error: 'Not allowed to edit review!'});
        }

        logger.info(`Deleting review ${id} from USERS collection`);
        await db.collection('users').doc(authenticatedUserId).collection('reviews').doc(id).delete();

        logger.info(`Deleting review ${id} from MOVIES collection`);
        await db.collection('movies').doc(movieId).collection('reviews').doc(id).delete();

        res.status(200).json({message: `Review ${id} deleted successfully.`});
    } catch (e) {
        logger.info(`Error deleting review: ${e}`);
        return res.status(500).json({ error: e.message });
    }
}

