import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
firestore;
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase in your project!');
});
