import type { NextApiRequest, NextApiResponse } from 'next';
import admin, { initializeFirebaseAdmin } from '../../utils/firebaseAdmin';
import { initialize } from 'next/dist/server/lib/render-server';

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
    initializeFirebaseAdmin();
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to allow specific origins as needed
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Specify the allowed HTTP method(s)
  
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required as a query parameter.' });
    }

    const db = admin.firestore();
    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json(doc.data());
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
