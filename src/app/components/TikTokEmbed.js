import React, { useEffect, useState } from 'react';

const TikTokEmbed = ({ url }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts
  }, []);

  return (
    <blockquote
      className="tiktok-embed"
      cite={url}
      data-video-id={url.split('/').pop()}
      style={{ maxWidth: '605px', margin: '0 auto', backgroundColor: 'black' }}
    >
      {isClient ? ( // Render iframe only on the client
        <section>
          <a href={url}>Watch this TikTok video</a>
          <iframe src={url} title="TikTok Video" />
        </section>
      ) : (
        <section>
          <a href={url}>Watch this TikTok video</a>
        </section>
      )}
    </blockquote>
  );
};

export default TikTokEmbed;