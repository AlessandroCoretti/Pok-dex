import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./App.css";

import PokèCardR from "./PokèCard";
import PokèCardL from "./PokèCardL";
import TopBar from "./TopBar";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemon, setPokemon] = useState([]);
  const [PkdxType, setPkdxType] = useState("");
  const [pokedexId, setPokedexId] = useState(2); // Default to Kanto (2)
  const [loading, setLoading] = useState(false);

  // Dedicated effect for resetting scroll when data changes
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [pokemon]);

  useEffect(() => {
    const fetchPkmn = async () => {
      console.log("Fetching Pokedex ID:", pokedexId);
      setLoading(true);
      try {
        const typePokedex = await fetch(`https://pokeapi.co/api/v2/pokedex/${pokedexId}/`);
        const pokedex = await typePokedex.json();
        const entries = pokedex.pokemon_entries;

        const PkdxTypeEntry = pokedex.names.find((entry) => entry.language.name === "en");
        const PkdxType = PkdxTypeEntry ? PkdxTypeEntry.name : "Unknown Pokédex";
        setPkdxType(PkdxType);

        // Process entries in parallel
        const pokemonDetails = await Promise.all(
          entries.map(async (entry) => {
            try {
              const pokemonNumber = entry.entry_number;
              const speciesName = entry.pokemon_species.name;
              const speciesUrl = entry.pokemon_species.url;

              // Extract ID from URL to ensure we get the correct default form token
              const idMatch = speciesUrl.match(/\/(\d+)\/$/);
              const speciesId = idMatch ? idMatch[1] : null;

              if (!speciesId) throw new Error("Could not parse ID from species URL");

              const speciesRes = await fetch(speciesUrl);
              if (!speciesRes.ok) throw new Error(`Species fetch failed for ${speciesName}`);
              const speciesData = await speciesRes.json();

              const descriptionObj = speciesData.flavor_text_entries?.find((entry) => entry.language.name === "en");
              const description = descriptionObj ? descriptionObj.flavor_text.replace(/\f/g, " ") : "No description available";

              // Fetch Pokemon Data by ID 
              const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesId}`);
              if (!pokemonRes.ok) throw new Error(`Pokemon fetch failed for ID ${speciesId}`);
              const pokemonData = await pokemonRes.json();

              const image = pokemonData.sprites.front_default ||
                pokemonData.sprites.other?.['official-artwork']?.front_default ||
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

              return {
                pokemonNumber,
                name: speciesName, // Use species name for clean display
                description,
                image,
                PkdxType,
              };
            } catch (err) {
              console.warn(`Skipping Pokemon ${entry.pokemon_species.name} due to error:`, err);
              return null;
            }
          })
        );

        // Filter valid and SORT by entry number to ensure list order matches logical order
        const validPokemon = pokemonDetails
          .filter(p => p !== null)
          .sort((a, b) => a.pokemonNumber - b.pokemonNumber);

        console.log("Details Fetched & Sorted:", validPokemon.length);

        setPokemon(validPokemon);
        if (validPokemon.length > 0) {
          setSelectedPokemon(validPokemon[0]);
        }

      } catch (e) {
        console.error("Critical Error during Pokedex fetch:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPkmn();
  }, [pokedexId]);

  /* GSAP Implementation */
  const cardsRef = useRef([]);
  const nodesCache = useRef([]);
  const lastSelectionTime = useRef(0);

  // Function to build/refresh the cache
  const refreshCache = () => {
    cardsRef.current = cardsRef.current.slice(0, pokemon.length);

    nodesCache.current = cardsRef.current.map(card => {
      if (!card) return null;
      return {
        card,
        inner: card.querySelector(".gsap-target"),
        arrow: card.querySelector(".gsap-arrow"),
        wrapper: card.querySelector(".gsap-target")?.parentElement
      };
    });
  };

  useGSAP(() => {
    // Rely only on POKEMON list. Not selectedPokemon.
    if (!listRef.current || pokemon.length === 0) return;

    // Build cache on mount/update
    refreshCache();

    const list = listRef.current;

    const updateSelection = () => {
      const focalPoint = list.scrollTop + 200;

      let closestCard = null;
      let minDistance = Infinity;
      const now = Date.now();

      nodesCache.current.forEach((node, index) => {
        if (!node) return;

        const { card, inner, arrow, wrapper } = node;

        const cardTop = card.offsetTop + (card.offsetHeight / 2);
        const distance = Math.abs(focalPoint - cardTop);

        const maxDist = 350;

        if (distance < maxDist) {
          const progress = 1 - (distance / maxDist);
          const easeProgress = Math.pow(progress, 2);

          const scale = 0.8 + (0.25 * easeProgress);
          const opacity = 0.7 + (0.3 * easeProgress);
          const rotateX = 20 * (1 - easeProgress);

          gsap.to(card, {
            scale: scale,
            opacity: opacity,
            rotationX: rotateX,
            duration: 0.05,
            overwrite: "auto"
          });

          if (inner) {
            const colorProgress = Math.max(0, (progress - 0.75) * 4);
            gsap.to(inner, {
              borderColor: `rgba(239, 68, 68, ${colorProgress})`,
              duration: 0.05,
              overwrite: "auto"
            });
          }

          if (wrapper) {
            const activeProgress = Math.max(0, (progress - 0.85) * 6.6);
            gsap.to(wrapper, {
              backgroundColor: `rgba(239, 68, 68, ${activeProgress})`,
              x: activeProgress * 10,
              padding: activeProgress > 0 ? "4px" : "0px",
              duration: 0.05,
              overwrite: "auto"
            });
          }

          if (arrow) {
            const arrowProgress = Math.max(0, (progress - 0.85) * 6.6);
            gsap.to(arrow, {
              opacity: arrowProgress,
              display: arrowProgress > 0.1 ? "block" : "none",
              duration: 0.05,
              overwrite: "auto"
            });
          }

        } else {
          if (distance < 600) {
            gsap.to(card, {
              scale: 0.8,
              opacity: 0.7,
              rotationX: 20,
              duration: 0.2,
              overwrite: "auto"
            });
            if (inner) gsap.to(inner, { borderColor: "transparent", duration: 0.2, overwrite: "auto" });
            if (wrapper) gsap.to(wrapper, { backgroundColor: "transparent", x: 0, padding: "0px", duration: 0.2, overwrite: "auto" });
            if (arrow) gsap.to(arrow, { opacity: 0, display: "none", duration: 0.2, overwrite: "auto" });
          }
        }

        if (distance < minDistance) {
          minDistance = distance;
          closestCard = pokemon[index];
        }
      });

      // Update State if changed
      if (closestCard) {
        // Throttle reduced to 30ms (approx 2 frames) for snappy response
        if (now - lastSelectionTime.current > 30) {
          setSelectedPokemon(prev => {
            if (prev?.name !== closestCard.name) {
              lastSelectionTime.current = now;
              return closestCard;
            }
            return prev;
          });
        }
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSelection();
          ticking = false;
        });
        ticking = true;
      }
    };

    list.addEventListener("scroll", handleScroll);
    updateSelection(); // Initial

    return () => list.removeEventListener("scroll", handleScroll);

  }, [pokemon]); // REMOVED selectedPokemon from dependencies!

  return (
    <div className="h-screen flex flex-col md:block md:h-auto perspective-1000 bg-[#646dd3]">
      <TopBar Type={PkdxType} onRegionSelect={setPokedexId} />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#646dd3] z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col md:grid md:grid-cols-2 md:mx-10 lg:mx-20 xl:mx-70 md:overflow-visible md:block">
        {pokemon.length > 0 && !loading && (
          <div className="shrink-0 max-h-[50vh] w-full bg-[#646dd3] z-10 md:static md:max-h-none md:bg-transparent md:w-auto transition-all duration-300">
            <PokèCardL
              key={selectedPokemon?.name}
              number={selectedPokemon?.pokemonNumber}
              name={selectedPokemon?.name}
              description={selectedPokemon?.description}
              image={selectedPokemon?.image}
            />
          </div>
        )}

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto overflow-x-hidden md:overflow-visible md:static md:col-span-1 md:mt-[45%] Perspective-container py-[150px]"
          style={{ perspective: "1000px" }} // Add perspective for 3D effect
        >
          {pokemon.map((p, index) => (
            <button
              key={p.name}
              onClick={() => {
                setSelectedPokemon(p);
              }}
              tabIndex={0}
              ref={el => cardsRef.current[index] = el}
              className="w-full block" // Ensure button takes full width
            >
              <PokèCardR
                number={p.pokemonNumber}
                name={p.name}
                description={p.description}
                image={p.image}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
