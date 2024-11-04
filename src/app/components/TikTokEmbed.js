// components/TikTokEmbed.js
import React from 'react';

const TikTokEmbed = ({ url }) => {
  return (
    <blockquote
      className="tiktok-embed"
      cite={url}
      data-video-id={url.split('/').pop()}
      style={{ maxWidth: '605px', margin: '0 auto', }}
    >
      <section>
        <a href={url}>Watch this TikTok video</a>
      </section>
    </blockquote>
  );
};

export default TikTokEmbed;