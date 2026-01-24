import express from 'express';
import cors from 'cors';
import {BASE_URL, CLIENT_PORT, express_logger, MOVIE_COLLECTION_NAME, SERVER_PORT} from "./config.js";
import {seedData} from "./data-gen.js";
import {usersRouter} from "./routes/users-routes.js";
import {authRouter} from "./routes/auth-routes.js";
import {verifyToken} from "./controllers/auth-controller.js";
import {moviesRouter} from "./routes/movies-routes.js";

seedData(MOVIE_COLLECTION_NAME);

const app = express();

app.use(express_logger);
app.use(cors({
    origin: [`${BASE_URL}:${CLIENT_PORT}`]
}))
app.use(express.urlencoded({extended: false}))

app.use(express.json())
app.use(verifyToken);
app.use(`/users`, usersRouter);
app.use(`/movies`, moviesRouter);
app.use(`/`, authRouter);


app.get('/', verifyToken, (req, res) => {
    res.send('Hello World!')
});


app.post('/data', (req, res) => {
    // destructuring
    const {name, email} = req.body; // validates keys exist

    // bad example:
    // let data = req.body;
    // console.log(data.name, data.email);

    console.log('Posting the following data: ', name, email);
    res.send('Success');
});

// Query params example
app.get('/greet', (req, res) => {
    const name = req.query.name;
    res.send(`Hello ${name}!`);
});
// Access: localhost:3000/greet?name=John

app.listen(SERVER_PORT, () => {
    console.log(`Example app listening on port ${SERVER_PORT}!`)
});