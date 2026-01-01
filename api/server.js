import express from 'express';
import cors from 'cors';
import {BASE_URL, CLIENT_PORT, express_logger, MOVIE_COLLECTION_NAME, SERVER_PORT} from "./config.js";
import {seedData} from "./data-gen.js";
import admin from "firebase-admin";
import {db} from "./db.js";

seedData(MOVIE_COLLECTION_NAME);

const app = express();

app.use(express_logger);
app.use(cors({
    origin: [`${BASE_URL}:${CLIENT_PORT}`]
}))
app.use(express.urlencoded({extended: false}))

app.use(express.json())

// Authorization
const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers.authorization?.split('Bearer ')[1];
    console.log(bearerToken);

    if (!bearerToken) {
        res.status(401).send('No token provided');
    }

    try {
        req.user = await admin.auth().verifyIdToken(bearerToken);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ error: 'Invalid token' });
    }
};


app.post('/verify', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const userRecord = await admin.auth().getUser(decodedToken.uid);

        const user = {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            emailVerified: userRecord.emailVerified,
            provider: userRecord.providerData[0]?.providerId
        };

        const existingUser = await db.collection('users').where('uid', '==', user.uid).get();
        if (existingUser.empty) {
            await db.collection("users").add(user);
        }

        res.json({
            success: true,
            user,
            message: 'User authenticated successfully'
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({
            error: 'Invalid token',
            details: error.message
        });
    }
});

app.post('/logout', verifyToken, async (req, res) => {
    try {
        await admin.auth().revokeRefreshTokens(req.user.uid);
        res.json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Error logging out' });
    }
});


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

// route params example
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    res.send(`User ID: ${id}`);
});
// Access: localhost:3000/users/123

app.listen(SERVER_PORT, () => {
    console.log(`Example app listening on port ${SERVER_PORT}!`)
});