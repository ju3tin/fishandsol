import type { NextApiRequest, NextApiResponse } from "next";
// Example of how your mongodb file might look
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI3;

if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(mongoUri);
export const clientPromise = client.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("chippy"); // your DB name here
    const messages = await db.collection("messages")
      .find({})
      .sort({ time: -1 })
      .limit(50)
      .toArray();

    res.status(200).json({ messages });
  } catch (error) {
    console.error("DB Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}