import firebaseConfig from './firebase-pk.json' with {type: 'json'};

import admin from 'firebase-admin';

function initFirestore() {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig)
    });

    return admin.firestore();
}

export const db = initFirestore();

