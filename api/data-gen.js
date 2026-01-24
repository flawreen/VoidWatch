import {faker} from '@faker-js/faker';
import {db} from './db.js';
import {logger} from "./config.js";

const NUM_MOVIES = 33;

async function generateMovies(count = 100) {
    logger.info(`Generating ${count} movies...`);
    const movies = [];
    for (let i = 0; i < count; i++) {
        movies.push({
            title: faker.book.title(),
            description: faker.lorem.paragraph({min: 20, max: 40}),
            minutes: faker.number.int({min: 70, max: 180}),
            year: faker.date.anytime().getFullYear(),
        });
    }
    logger.info(`Successfully generated ${count} movies!`);
    return movies;
}

async function generateReviews(num) {
    const reviews = [];

    for (let i = 0; i < num; i++) {
        reviews.push({
            userId: `${faker.string.alphanumeric(10)}`,
            userName: faker.person.fullName(),
            title: faker.lorem.paragraph({ min: 1, max: 1 }),
            rating: faker.number.int({ min: 1, max: 5 }),
            description: faker.lorem.paragraph({ min: 5, max: 15 }),
            createdAt: faker.date.recent({ days: 30 }).toISOString()
        });
    }

    return reviews;
}

async function insertMoviesWithReviews(movies) {
    logger.info(`Generating batch of ${movies.length} documents...`);
    const batch = db.batch();

    for (const movie of movies) {
        const movieRef = db.collection('movies').doc();
        batch.set(movieRef, movie);

        const reviews = await generateReviews(5);
        reviews.forEach(review => {
            const reviewRef = movieRef.collection('reviews').doc();
            batch.set(reviewRef, review);
        });

    }
    logger.info(`Writing batch to Firebase...`);
    await batch.commit();
    logger.info(`Batch successfully written!`);
}

export async function seedData(collection_name) {
    const doc_count_query = await db.collection(collection_name).count().get();
    const doc_count = doc_count_query["_data"]["count"];
    if (doc_count <= 1) {
        await insertMoviesWithReviews(await generateMovies(NUM_MOVIES));
    } else {
        logger.info(`Collection ${collection_name} already contains documents!`);
    }
}

