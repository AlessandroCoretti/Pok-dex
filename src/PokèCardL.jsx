function PokèCardL(pokemon) {
  const Pkmn = pokemon.image;
  return (
    <div className=" flex justify-center">
      <span className="flex flex-col items-center justify-center bg-cyan-100 h-fit sticky top-[15%] p-10 border border-4 ring-4 ring-amber-300 border-blue-300 rounded-[8px] w-50 sm:w-100 md:w-100">
        <img className=" h-[200px] w-[200px] " src={Pkmn} alt={pokemon.name} />
        <p>{pokemon.description}</p>
      </span>
    </div>
  );
}

export default PokèCardL;
