import { getTweets, Tweet } from '@/lib/getTweets';

// Server component (default in app/)
export default async function TweetPage() {
  const tweets: Tweet[] = await getTweets();

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Latest Tweets</h1>
      <ul className="space-y-4">
        {tweets.map((tweet) => (
          <li key={tweet.id} className="p-4 border rounded-xl shadow">
            <p className="font-semibold">@{tweet.user}</p>
            <p className="text-gray-700">{tweet.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}