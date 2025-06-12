"use client"
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';

// Define Tweet type
type Tweet = {
  id: string;
  user: string;
  content: string;
};

type TweetsPageProps = {
  tweets: Tweet[];
};

export default function TweetsPage({ tweets }: TweetsPageProps) {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Latest Tweets</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tweets.map((tweet) => (
          <li
            key={tweet.id}
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
            }}
          >
            <p>
              <strong>@{tweet.user}</strong>
            </p>
            <p>{tweet.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'data', 'tweets.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const tweets: Tweet[] = JSON.parse(jsonData);

  return {
    props: {
      tweets,
    },
  };
};