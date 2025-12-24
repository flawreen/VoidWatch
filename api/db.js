import firebaseConfig from './firebase-pk.json' with {type: 'json'};

import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

export const db = admin.firestore();

