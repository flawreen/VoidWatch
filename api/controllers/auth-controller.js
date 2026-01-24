import admin from "firebase-admin";
import {db} from "../db.js";

export const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers.authorization?.split('Bearer ')[1];

    if (!bearerToken) {
        return res.status(401).send('No token provided');
    }

    try {
        req.user = await admin.auth().verifyIdToken(bearerToken);
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

export const verify = async (req, res) => {
    const bearerToken = req.headers.authorization?.split('Bearer ')[1];

    if (!bearerToken) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(bearerToken);

        const userRecord = await admin.auth().getUser(decodedToken.uid);

        const user = {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            provider: userRecord.providerData[0]?.providerId
        };

        const existingUser = await db
            .collection('users')
            .where('uid', '==', user.uid)
            .get();

        if (existingUser.empty) {
            await db.collection('users').doc(decodedToken.uid).set(user);
        }

        res.json({
            success: true,
            user,
            message: 'User authenticated successfully'
        });

    } catch (error) {
        return res.status(403).json({
            error: 'Invalid token',
            details: error.message
        });
    }
};


export const logout = async (req, res) => {
    try {
        await admin.auth().revokeRefreshTokens(req.user.uid);
        res.json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Error logging out' });
    }
};