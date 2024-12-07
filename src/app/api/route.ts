import { getErrorResponse, getSuccessResponse } from '@/utils/serverResponses'
import dbConnect from '../../../lib/dbConnect';
import Message from  '../../../models/messages'; // Ensure you have this model

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
