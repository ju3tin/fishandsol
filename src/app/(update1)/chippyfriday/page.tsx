'use client';

import React, { useEffect, useState } from 'react';
import TwitterEmbed from '../../components/TwitterEmbed';

type Tweet = {
  id: string;
  url: string;
};

export default function TweetPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    const fetchTweets = async () => {
      const res = await fetch('/data/tweets.json');
      const json = await res.json();
      setTweets(json);
    };
    fetchTweets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Get Your Free Chips When you buy Chippy Tokens</h1>
      <div className="space-y-6">
        {tweets.map((tweet) => (
          <TwitterEmbed key={tweet.id} tweetUrl={tweet.url} />
        ))}
      </div>
    </div>
  );
}