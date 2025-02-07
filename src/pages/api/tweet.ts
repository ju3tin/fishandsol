import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import multer from "multer";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import * as dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

// Configure Multer for file uploads
const upload = multer({ dest: "public/uploads/" });
const uploadMiddleware = promisify(upload.single("image"));

// Initialize Twitter Client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_API_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_API_ACCESS_SECRET!,
});

// Extend NextApiRequest to include the file property
interface ExtendedNextApiRequest extends NextApiRequest {
  file?: Express.Multer.File; // Define the file property
}

export const config = {
  api: { bodyParser: false }, // Required for handling file uploads
};

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await uploadMiddleware(req as unknown as Request, res as unknown as Response);

    const { tweetText } = req.body;
    if (!tweetText) return res.status(400).json({ error: "Tweet text is required" });

    let mediaId;
    if (req.file) {
      const imagePath = path.join(process.cwd(), "public/uploads", req.file.filename);
      const imageData = fs.readFileSync(imagePath);
      mediaId = await twitterClient.v1.uploadMedia(imageData);
      fs.unlinkSync(imagePath); // Delete file after upload
    }

    // Post the tweet
    const tweet = await twitterClient.v2.tweet({
      text: tweetText,
      media: mediaId ? { media_ids: [mediaId] } : undefined,
    });

    if (!tweet.data?.id) {
      return res.status(500).json({ error: "Tweet failed to post." });
    }

    const tweetId = tweet.data.id;
    const tweetUrl = `https://twitter.com/user/status/${tweetId}`; // Replace "user" with your Twitter username

    res.status(200).json({ success: true, tweetUrl });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}