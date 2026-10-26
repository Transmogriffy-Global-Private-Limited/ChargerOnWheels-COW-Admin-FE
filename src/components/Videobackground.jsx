// src/components/VideoBackground.js
import React, { useEffect, useState } from 'react';

// Import videos directly from the src folder
// import carVideo from '../assets/car.mov';
// import car2Video from '../assets/car2.mp4';
// import car3Video from '../assets/car3.mp4';
import websitevideo from '../assets/web.mp4';
//  import background from '../assets/background.mp4';

function VideoBackground() {
  const [videoIndex, setVideoIndex] = useState(0);

  // const videos = [ car3Video,car2Video,carVideo];
  const videos =[websitevideo];

  // Cycle through the videos every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 8000); // Change video every 8 seconds
    return () => clearInterval(interval);
  }, [videos.length]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {videos.map((video, index) => (
        <video
          key={index}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${videoIndex === index ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          muted
          loop
        >
          {/* Video sources for both MP4 and MOV */}
          <source src={video} type="video/mp4" />
          {/* Add alternative source for .mov format */}
          {/* {video === carVideo && <source src={carVideo} type="video/quicktime" />} */}
        </video>
      ))}
    </div>
  );
}

export default VideoBackground;
