const ResponsiveIframe = ({ width = 800, height = 400 }) => {
    const aspectRatio = (height / width) * 100; // Convert to percentage
  
    return (
      <div className="relative w-full" style={{ paddingTop: `${aspectRatio}%` }}>
        <iframe
          src='/test6'
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  export default ResponsiveIframe;