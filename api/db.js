import firebaseConfig from './firebase-pk.json' with {type: 'json'};

import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

const db = admin.firestore();

const moviesRef = db.collection('movies');
const moviesSnapshot = await moviesRef.get();

moviesSnapshot.forEach(doc => {
    console.log(doc.id, doc.data());
})























