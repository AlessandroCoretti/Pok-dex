import React from 'react';

const PokèCardR = React.memo(({ number, name, image }) => {
  // Static classes for GSAP to animate
  // Initial state: border-transparent, no active translation

  return (
    <div className="col-span-1 flex justify-end mb-1 w-full translate-z-0 will-change-transform">
      <span className="flex items-center transition-all duration-300 ps-2 rounded-l-lg hover:bg-transparent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="White"
          className="bi bi-caret-right-fill gsap-arrow opacity-0 hidden will-change-opacity"
          viewBox="0 0 16 16"
        >
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
        </svg>
        <span className="gsap-target w-80 bg-amber-300 flex rounded-l-[50px] items-center justify-between px-5 gap-2 border-2 border-transparent hover:border-white transition-all duration-300 will-change-transform">
          <img className="h-[50px] w-[50px]" src={image} alt={name} />
          <p className="text-lg p-0 m-0">No.{number}</p>
          <p className="text-lg p-0 m-0">{name}</p>
        </span>
      </span>
    </div>
  );
});

export default PokèCardR;
