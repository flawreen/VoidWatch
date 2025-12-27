import express from 'express';
import cors from 'cors';
import {BASE_URL, CLIENT_PORT, logger, SERVER_PORT} from "./config.js";

const app = express();

app.use(logger);
app.use(cors({
    origin: [`${BASE_URL}:${CLIENT_PORT}`]
}))
app.use(express.urlencoded({extended: false}))

app.use(express.json())

app.get('/', (req, res) => {
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

// route params example
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    res.send(`User ID: ${id}`);
});
// Access: localhost:3000/users/123

app.listen(SERVER_PORT, () => {
    console.log(`Example app listening on port ${SERVER_PORT}!`)
});