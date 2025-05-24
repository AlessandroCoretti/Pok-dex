import { useEffect, useState } from "react";
import "./App.css";

import PokèCardR from "./PokèCard";
import PokèCardL from "./PokèCardL";
import TopBar from "./TopBar";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemon, setPokemon] = useState([]);
  const [PkdxType, setPkdxType] = useState("");
  useEffect(() => {
    const fetchPkmn = async () => {
      try {
        const typePokedex = await fetch("https://pokeapi.co/api/v2/pokedex/2/"); //Kanto Pokèdex
        const pokedex = await typePokedex.json();
        const entries = pokedex.pokemon_entries;
        const PkdxTypeEntry = pokedex.names.find((entry) => entry.language.name === "en");
        const PkdxType = PkdxTypeEntry ? PkdxTypeEntry.name : "Unknown Pokédex";
        setPkdxType(PkdxType);

        const pokemonDetails = await Promise.all(
          entries.map(async (entry) => {
            const pokemonNumber = entry.entry_number;

            const name = entry.pokemon_species.name;
            const speciesRes = await fetch(entry.pokemon_species.url);
            const speciesData = await speciesRes.json();

            const descriptionObj = speciesData.flavor_text_entries.find((entry) => entry.language.name === "en"); //lingua del Pokèdex
            const description = descriptionObj ? descriptionObj.flavor_text.replace(/\f/g, " ") : "No description available";

            const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`); //Pokèemon singolo
            const pokemonData = await pokemonRes.json();
            const image = pokemonData.sprites.front_default; //immagine frontale pkm

            return {
              pokemonNumber,
              name,
              description,
              image,
              PkdxType,
            };
          })
        );

        setPokemon(pokemonDetails);
        setSelectedPokemon(pokemonDetails[0]);
      } catch (e) {
        console.error("Errore durante il recupero nella fetch", e);
      }
    };
    fetchPkmn();
  }, []); //chiama la fetch SOLO al primo rendering

  return (
    <div>
      <TopBar Type={PkdxType} />
      <div className=" grid grid-cols-2 md:mx-10 lg:mx-20 xl:mx-70">
        {pokemon.length > 0 && (
          <PokèCardL
            key={selectedPokemon.name}
            number={selectedPokemon.pokemonNumber}
            name={selectedPokemon.name}
            description={selectedPokemon.description}
            image={selectedPokemon.image}
          />
        )}

        <div className="flex flex-col col-span-1 mt-[45%]">
          {pokemon.map((p) => (
            <button key={p.name} onClick={() => setSelectedPokemon(p)} tabIndex={0}>
              <PokèCardR number={p.pokemonNumber} name={p.name} description={p.description} image={p.image} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
