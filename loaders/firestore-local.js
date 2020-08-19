const admin = require('firebase-admin');
const serviceAccount = require('../aoc-runescape-discord.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

global.db = admin.firestore();