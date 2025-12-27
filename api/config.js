import morgan from 'morgan';
import winston from "winston";

export const SERVER_PORT = 8080;
export const CLIENT_PORT = 3000;
export const BASE_URL = 'http://localhost';
export const express_logger = morgan('dev');
export const MOVIE_COLLECTION_NAME = 'movies';
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
    ],
});