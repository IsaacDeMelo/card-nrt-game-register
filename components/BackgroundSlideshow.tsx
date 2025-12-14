import React, { useState, useEffect } from 'react';

const IMAGES = [
  "https://i.pinimg.com/originals/1c/b7/40/1cb74003661914b3a9f3b12771c8cb20.png",
  "https://i.pinimg.com/originals/c4/f2/6e/c4f26eebb1537abac1ec5d1aad60fc43.png",
  "https://i.pinimg.com/originals/c4/27/53/c42753d4c7b1307ac5c1beb822d35750.png",
  "https://i.namu.wiki/i/5E49YCyql0dS7PLUcm365bnJ9CmcLmOYopBPagIZ2RBXdZfZhlDuO9nYQ0gPYhDI2qY5_msZRgNetFVbdFUAYg.webp"
];

interface Props {
  isVisible: boolean;
}

const BackgroundSlideshow: React.FC<Props> = ({ isVisible }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div 
      className={`absolute inset-0 w-full h-full flex justify-center transition-all duration-700 pointer-events-none ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      {IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i}`}
          className={`slide-image absolute h-[85%] object-contain animate-float drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};

export default BackgroundSlideshow;