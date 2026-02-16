import React from 'react';

const PokèCardL = React.memo(({ image, name, description }) => {
  return (
    <div className=" flex justify-center">
      <span className="flex flex-col items-center justify-center bg-cyan-100 h-fit p-4 border border-4 ring-4 ring-amber-300 border-blue-300 rounded-[8px] w-full max-w-[400px] sm:w-100 md:w-100 overflow-hidden">
        <img className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] object-contain" src={image} alt={name} />
        <p className="text-sm md:text-base text-center overflow-y-auto max-h-[100px] md:max-h-none">{description}</p>
      </span>
    </div>
  );
});

export default PokèCardL;
