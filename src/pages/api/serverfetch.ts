import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const partnerResponse = await axios.post('https://elitemma.vercel.app/api/getURL', req.body);
      res.status(200).json(partnerResponse.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data from partner API', error: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
