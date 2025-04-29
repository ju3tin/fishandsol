// pages/api/messages.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongolb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db('chippie'); // Replace with your actual DB name
    const collection = db.collection('messages');

    if (req.method === 'GET') {
        try {
            const messages = await collection.find({}).sort({ time: -1 }).toArray();
            return res.status(200).json(messages);
        } catch (error) {
            console.error('GET error:', error);
            return res.status(500).json({ message: 'Failed to fetch messages' });
        }
    }

    if (req.method === 'POST') {
        const { walletAddress, time, message } = req.body;

        if (!walletAddress || !time || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const result = await collection.insertOne({
                walletAddress,
                time,
                message,
            });

            return res.status(201).json({
                message: 'Message stored successfully',
                insertedId: result.insertedId,
            });
        } catch (error) {
            console.error('POST error:', error);
            return res.status(500).json({ message: 'Failed to store message' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}