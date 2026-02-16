import { useState } from "react";

function TopBar({ Type, onRegionSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const regions = [
    { name: "Kanto", id: 2 },
    { name: "Johto", id: 3 },
    { name: "Hoenn", id: 4 },
    { name: "Sinnoh", id: 5 },
    { name: "Unova", id: 8 },
    { name: "Kalos", id: 12 },
    { name: "Alola", id: 16 },
    { name: "Galar", id: 27 },
    { name: "Paldea", id: 31 },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[#646dd3] px-4 py-2 shadow-md">
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#68c6ec] border-2 border-[#332e8a] shadow-xl rounded-[50px] p-1 flex items-center justify-start gap-2 cursor-pointer hover:bg-[#5bb0d1] transition-colors"
        >
          <div className="h-[20px] w-[20px] rounded-[50px] bg-blue-400"></div>
          <h2 className="text-md font-bold text-white px-2">
            Pokèdex {Type} ▾
          </h2>
          <div className="h-[20px] w-[20px] rounded-[50px] bg-blue-400"></div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-[#332e8a] overflow-hidden">
            <ul className="py-1 max-h-[60vh] overflow-y-auto">
              {regions.map((region) => (
                <li key={region.id}>
                  <button
                    onClick={() => {
                      console.log("Selected Region:", region.id, region.name);
                      onRegionSelect(region.id);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-[#332e8a] hover:bg-[#68c6ec] hover:text-white transition-colors"
                  >
                    {region.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
