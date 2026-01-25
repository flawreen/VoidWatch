import {db} from "../db.js";
import {logger} from "../config.js";

export const getMovieById = async (req, res) => {
    try {
        const id = req.params.id;

        logger.info(`Checking if movie with id ${id} exists`);
        const doc = await db.collection('movies').doc(id);
        const docValue = await doc.get();
        if (!docValue.exists) {
            return res.status(404).json({error: 'Movie not found.'});
        }
        logger.info('Movie found!');
        return res.status(200).json(docValue.data());
    } catch (e) {
        logger.info(`Error retrieving movie by id: ${e}`);
        res.status(500).json({error: e.message});
    }
}

export const getAllMovies = async (req, res) => {
    try {
        logger.info('Retrieving all movies...');
        const collection = await db.collection('movies').get();

        const movies = collection.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return res.status(200).json(movies);
    } catch (e) {
        logger.info(`Error retrieving movies: ${e}`);
        res.status(500).json({error: e.message});
    }
}