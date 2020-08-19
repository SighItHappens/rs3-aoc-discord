const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});


global.db = admin.firestore();