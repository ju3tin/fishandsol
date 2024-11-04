// components/InstagramEmbed.js
import React, { useEffect } from 'react';

const InstagramEmbed = ({ url }) => {
  useEffect(() => {
    // This function ensures that the Instagram embed script runs after the component mounts
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      // Call the Instagram embed function once the script loads
      window.instgrm.Embeds.process();
    };
    document.body.appendChild(script);

    // Clean up the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="12"
      style={{ margin: '1px', maxWidth: '540px', width: 'calc(100% - 2px)', border: '0', borderRadius: '3px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
    >
      <a href={url}>View this post on Instagram</a>
    </blockquote>
  );
};

export default InstagramEmbed;