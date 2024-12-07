import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to the database
    const db = await connectToDatabase();
    const messagesCollection = db.collection("messages");

    // Fetch messages, sorted by timestamp
    const messages = await messagesCollection
      .find({})
      .sort({ timestamp: -1 }) // Sort messages by newest first
      .toArray();

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}