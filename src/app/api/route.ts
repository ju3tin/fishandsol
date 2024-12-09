import { getErrorResponse, getSuccessResponse } from '@/utils/serverResponses'
import dbConnect from '../../../lib/dbConnect';
import Message from  '../../../models/messages'; // Ensure you have this model
// pages/api/example.js
import Cors from "cors";
import initMiddleware from "../../utils/init-middleware";
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize the CORS middleware
const cors = initMiddleware(
    Cors({
        origin: "*", // Allow this origin
        methods: ["GET", "POST"], // Allow these methods
    })
);
/*
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await cors(req, res);

    res.status(200).json({ message: "Hello, this is working!" });
}

*/
// GET /api/messages
export async function GET(req: Request) {
	try {
		await dbConnect();

		// Fetch messages from MongoDB
		const messages = await Message.find({});
		return getSuccessResponse(messages);
	} catch (error: any) {
		return getErrorResponse(500, error.message, error)
	}
}

// POST /api/messages
export async function POST(req: Request) {
	try {
		await dbConnect();

		// Get params
		const params = await req.json()
		console.log({ params })

		// Save a new message to MongoDB
		const message = new Message(params);
		await message.save();

		// Return success
		return getSuccessResponse(message);
	} catch (error: any) {
		return getErrorResponse(500, error.message, error)
	}
}
