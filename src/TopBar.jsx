function TopBar(pokemon) {
  return (
    <div className="sticky top-0 z-10 bg-blue-400 px-4 py-2 border-b-3 shadow-md">
      <div className="bg-[#68c6ec] border border-2 border-[#332e8a] shadow-xl w-fit rounded-[50px] p-1 flex items-center justify-start gap-2">
        <div className="h-[20px] w-[20px] rounded-[50px] bg-blue-400"></div>
        <h2 className="text-md font-bold text-white ">Pokèdex {pokemon.Type}</h2>
        <div className="h-[20px] w-[20px] rounded-[50px] bg-blue-400 ms-5"></div>
      </div>
    </div>
  );
}

export default TopBar;
