import React from "react";

const ResponsiveIframe = () => {
  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="relative pt-[50%]">
        <iframe
          src='/test6'
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default ResponsiveIframe;