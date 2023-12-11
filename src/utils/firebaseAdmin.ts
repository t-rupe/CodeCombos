import * as admin from 'firebase-admin';

let firebaseInitialized = false;

export const initializeFirebaseAdmin = () => {
  if (!firebaseInitialized && !admin.apps.length) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');
      const projectId = process.env.FIREBASE_PROJECT_ID!;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
      const databaseURL = process.env.FIREBASE_DATABASE_URL!;

      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        databaseURL,
      });

      firebaseInitialized = true;
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
    }
  }
};

export default admin;
