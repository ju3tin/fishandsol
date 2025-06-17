'use client';

import { useState } from 'react';

export default function TweetFormPage() {
  const [tweet, setTweet] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tweetText = encodeURIComponent(tweet);
    const tweetUrl = `https://twitter.com/intent/tweet?text=#ChippyFriday ${tweetText}`;

    window.open(tweetUrl, '_blank');
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Tweet Something</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md">
        <textarea
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="Write your tweet here..."
          rows={4}
          className="border rounded p-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tweet
        </button>
      </form>
    </main>
  );
}
