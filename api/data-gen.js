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
            reviews: []
        });
    }
    logger.info(`Successfully generated ${count} movies!`);
    return movies;
}

async function insertBulk(list) {
    logger.info(`Generating batch of ${list.length} documents...`);
    const batch = db.batch();

    list.forEach(item => {
        const docRef = db.collection('movies').doc();
        batch.set(docRef, item);
    });
    logger.info(`Writing batch to Firebase...`);
    await batch.commit();
    logger.info(`Batch successfully written!`);
}

export async function seedData(collection_name) {
    const doc_count_query = await db.collection(collection_name).count().get();
    const doc_count = doc_count_query["_data"]["count"];
    if (doc_count <= 1) {
        await insertBulk(await generateMovies(NUM_MOVIES));
    } else {
        logger.info(`Collection ${collection_name} already contains documents!`);
    }
}

