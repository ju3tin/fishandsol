"use client"
import React from 'react';
import InstagramEmbed from '../components/InstagramEmbed';
import TikTokEmbed from '../components/TikTokEmbed';
import TwitterEmbed from '../components/TwitterEmbed';


export default function social() {
    const tweetUrl = 'https://twitter.com/ju3t1ng/status/1845047137077203376';
    const tiktokPostUrl = 'https://www.tiktok.com/@ju3ting/video/7314258976999361824';
    const instagramPostUrl = 'https://www.instagram.com/p/DB8SQnFuLdS/';
    return (
        <div>
            
            <div>
            <br></br>
      <TwitterEmbed tweetUrl={tweetUrl} />
    </div>

<div>
     <br></br>
      <InstagramEmbed url={instagramPostUrl} />
    </div>

    <div>
    <br></br>
      <TikTokEmbed url={tiktokPostUrl} />
      <script async src="https://www.tiktok.com/embed.js"></script>
    </div>


</div>
)}


