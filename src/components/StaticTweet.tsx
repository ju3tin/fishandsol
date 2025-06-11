// components/StaticTweet.tsx

import React from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import Image from 'next/image';

interface StaticTweetProps {
  name: string;
  username: string;
  avatarUrl: string;
  date: string;
  content: string;
  replies?: number;
  likes?: number;
}

const StaticTweet: React.FC<StaticTweetProps> = ({
  name,
  username,
  avatarUrl,
  date,
  content,
  replies = 0,
  likes = 0,
}) => {
  return (
    <div className="max-w-xl border rounded-2xl p-4 shadow bg-white dark:bg-neutral-900">
      <div className="flex items-start space-x-4">
        <Image
          src={avatarUrl}
          alt={`${name}'s avatar`}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{name}</span>
            <span className="text-sm text-gray-500">@{username} · {date}</span>
          </div>
          <p className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-line">{content}</p>
          <div className="flex mt-4 space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{replies}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticTweet;
