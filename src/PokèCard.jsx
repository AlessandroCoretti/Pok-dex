function PokèCardR(pokemon) {
  return (
    <div className="col-span-1 flex justify-end mb-1 ">
      <span className="flex items-center hover:bg-red-500 hover:py-1 hover:px-1 hover:scale-105  transform hover:-translate-x-1/20 transition-all duration-300 ps-2 group rounded-l-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="White"
          className="bi bi-caret-right-fill hidden group-hover:block"
          viewBox="0 0 16 16"
        >
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
        </svg>
        <span className="w-80 bg-amber-300 flex rounded-l-[50px] items-center justify-between px-5 gap-2 hover:border hover:border-1 hover:border-white">
          <img className="h-[50px] w-[50px]" src={pokemon.image} alt={pokemon.name} />
          <p className="text-lg p-0 m-0">No.{pokemon.number}</p>
          <p className="text-lg p-0 m-0">{pokemon.name}</p>
        </span>
      </span>
    </div>
  );
}

export default PokèCardR;
