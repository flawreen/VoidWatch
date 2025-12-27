import morgan from 'morgan';

export const SERVER_PORT = 8080;
export const CLIENT_PORT = 3000;
export const BASE_URL = 'http://localhost';
export const logger = morgan('dev');