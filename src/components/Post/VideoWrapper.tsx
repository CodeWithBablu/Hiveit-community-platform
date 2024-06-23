import { useEffect, useRef } from 'react';

const VideoWrapper = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        });
      },
      {
        threshold: 0.5,// range when to stop video( stop when video element goes half way to top or bottom)
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      muted
      autoPlay
      loop
      src={src}
      className="peer relative h-full w-full border-[1px] border-gray-700 rounded-2xl cursor-pointer object-cover"
    >
      can't load video
    </video>
  );
};

export default VideoWrapper;
