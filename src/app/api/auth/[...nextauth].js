// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

// Add a root layout
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  return NextAuth(req, res, {
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        version: "2.0", // opt-in to Twitter OAuth 2.0
      }),
    ],
    // Optional: Add a database adapter or callbacks if needed
  });
}