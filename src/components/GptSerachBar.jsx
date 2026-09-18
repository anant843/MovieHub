import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import { useRef, useState, useEffect } from "react";
import { generateWithFallback } from "../utils/openai";
import { API_OPTIONS, TMDB_BASE, SUPPORTED_LANGUAGES } from "../utils/constants";
import { addSearchedMovies } from "../store/gptSlice";
import { changeLanguage } from "../store/configSlice";
import { FaGlobe, FaSearch, FaChevronDown, FaCheck } from "react-icons/fa";

const QUICK_CHIPS = [
  { label: "🚀 Mind-Bending Sci-Fi", query: "mind-bending sci-fi movies like Interstellar" },
  { label: "😂 Heartwarming Comedy", query: "hilarious heartwarming comedies for family" },
  { label: "🍿 90s Nostalgia", query: "best 90s action thriller and adventure blockbusters" },
  { label: "🕵️ Suspense Mystery", query: "gripping murder mystery whodunnit movies" },
  { label: "🏎️ High-Octane Action", query: "fast-paced action movies with cars and chases" },
  { label: "👻 Psychological Horror", query: "creepy psychological horror films with plot twists" },
];

const GptSearchBar = () => {
  const currentLanguage = useSelector((state) => state.config.language);
  const searchText = useRef(null);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.identifier === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const handleSelectLanguage = (langId) => {
    dispatch(changeLanguage(langId));
    setIsDropdownOpen(false);
  };

  const searchMovies = async (movieName) => {
    try {
      const data = await fetch(
        `${TMDB_BASE}/search/movie?query=${encodeURIComponent(
          movieName
        )}&include_adult=false&language=en-US&page=1`,
        API_OPTIONS
      );
      const json = await data.json();
      return json.results || [];
    } catch {
      return [];
    }
  };

  const handleSearch = async (overrideQuery) => {
    const query = (overrideQuery || searchText.current?.value)?.trim();
    if (!query || isSearching) return;

    if (overrideQuery && searchText.current) {
      searchText.current.value = overrideQuery;
    }

    setIsSearching(true);

    const searchQuery = `Act as a professional movie recommendation engine.
Analyze the following user query: "${query}".
Select 5 to 10 top-rated movies that match the query, ensuring:
- the language/origin of the movie should be "${currentLanguage}" (unless the query specifies otherwise)
- Return ONLY the movie titles, separated by commas, with no numbering, no bullet points, no extra words, and no line breaks. Example format:
The Shawshank Redemption, Inception, Spirited Away, Parasite, Casablanca`;

    let recommendedMovies = [];
    try {
      const rawText = await generateWithFallback(searchQuery);
      recommendedMovies = (rawText ?? "")
        .split(",")
        .map((m) => m.replace(/[\n\r\*]/g, "").trim())
        .filter(Boolean);
    } catch (err) {
      console.warn("AI recommendation failed, falling back to direct TMDB search:", err);
      recommendedMovies = [query];
    }

    // Fetch movie details from TMDB for each recommended title
    const data = recommendedMovies.map((movie) => searchMovies(movie));
    const movieData = await Promise.all(data);

    // Fallback: If AI titles returned no results on TMDB, search user query directly
    const totalFound = movieData.reduce((acc, curr) => acc + (curr?.length || 0), 0);
    if (totalFound === 0) {
      const directResults = await searchMovies(query);
      if (directResults && directResults.length > 0) {
        recommendedMovies = [`Results for "${query}"`];
        movieData[0] = directResults;
      }
    }

    dispatch(
      addSearchedMovies({
        moviesName: recommendedMovies,
        moviesList: movieData,
      })
    );
    setIsSearching(false);
  };

  return (
    <div className="flex flex-col items-center my-6 px-4 max-w-4xl mx-auto w-full">
      {/* Unified Search Console with Custom Glassmorphic Language Pill */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="w-full max-w-3xl bg-neutral-900/90 border border-neutral-700/80 rounded-2xl shadow-2xl p-2 sm:p-2.5 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2 sm:gap-3 hover:border-neutral-600 transition-all"
      >
        {/* Custom Glassmorphic Language Selector Pill */}
        <div ref={dropdownRef} className="relative w-full sm:w-auto shrink-0 select-none">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 bg-neutral-800/90 hover:bg-neutral-800 rounded-xl border border-neutral-700/80 text-xs text-white transition-all cursor-pointer w-full sm:w-auto shadow-md hover:border-neutral-500 active:scale-95"
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{selectedLangObj.flag}</span>
              <span className="font-semibold text-xs sm:text-sm">{selectedLangObj.name}</span>
            </div>
            <FaChevronDown
              className={`text-[10px] text-gray-400 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180 text-purple-400" : ""
              }`}
            />
          </button>

          {/* Animated Custom Glassmorphic Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-56 bg-neutral-900/95 backdrop-blur-2xl border border-neutral-700/90 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50 animate-fadeIn">
              <div className="px-3.5 py-1.5 border-b border-neutral-800 text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center justify-between">
                <span>Select Language</span>
                <FaGlobe className="text-purple-400 text-xs" />
              </div>
              <div className="py-1">
                {SUPPORTED_LANGUAGES.map((l) => {
                  const isSelected = l.identifier === currentLanguage;
                  return (
                    <button
                      key={l.identifier}
                      type="button"
                      onClick={() => handleSelectLanguage(l.identifier)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-600/20 text-white font-bold border-l-2 border-purple-500"
                          : "text-gray-300 hover:bg-neutral-800/80 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{l.flag}</span>
                        <div>
                          <p className="font-medium">{l.name}</p>
                          <p className="text-[10px] text-gray-400">{l.native}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <FaCheck className="text-purple-400 text-xs shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Search Input Field */}
        <div className="relative flex-1 w-full flex items-center">
          <FaSearch className="text-gray-500 ml-2 mr-1 text-sm hidden sm:block shrink-0" />
          <input
            ref={searchText}
            type="text"
            placeholder={
              lang[currentLanguage]?.searchPlaceholder || "What do you want to watch today?"
            }
            className="w-full bg-transparent text-white px-2.5 py-2 text-sm sm:text-base placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          disabled={isSearching}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-xl transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Thinking...</span>
            </>
          ) : (
            lang[currentLanguage]?.search || "Search"
          )}
        </button>
      </form>

      {/* Quick Mood Suggestion Chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-3xl">
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSearch(chip.query)}
            disabled={isSearching}
            className="text-xs bg-neutral-900/90 hover:bg-neutral-800 text-gray-300 hover:text-white px-3 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GptSearchBar;
