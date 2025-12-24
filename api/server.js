import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
const app = express();
const port = 8080;

app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:3000']
}))
app.use(express.urlencoded({ extended: false }))
// json req - res
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
});


// ROUTES

app.post('/data', (req, res) => {
    // destructuring
    const { name, email } = req.body; // validates keys exist

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});