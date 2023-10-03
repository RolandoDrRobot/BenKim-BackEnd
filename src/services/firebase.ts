require('dotenv').config();

function run() {
  const firebase = require('firebase-admin');
  console.log('ROLOOOOOOOO');
  console.log(process.env.private_key);
  console.log('ROLOOOOOOOO');
  const firebaseAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri:process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain
  }

  firebase.initializeApp({
    credential: firebase.credential.cert(firebaseAccount)
  });

  const database = firebase.firestore();
  return database;
}
export { run };
