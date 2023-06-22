function run() {
  const firebase = require('firebase-admin');
  const firebaseAccount = require('../keys.json');

  firebase.initializeApp({
    credential: firebase.credential.cert(firebaseAccount)
  });

  const database = firebase.firestore();
  return database;
}

export { run };
