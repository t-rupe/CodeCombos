import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../utils/firebaseAdmin';

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure we're receiving a GET request
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
    // Handle any errors
    return res.status(500).json({ error: error });
  }
}
