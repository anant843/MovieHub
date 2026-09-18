import GptSearchBar from "./GptSerachBar";
import lang from "../utils/languageConstants";
import { useSelector } from "react-redux";
import MovieSuggestion from "./MovieSuggestion";

const GptSearchPage = () => {
  const currentLanguage = useSelector((state) => state.config.language);

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-28 px-4">
      {/* Centered AI Header */}
      <div className="text-center max-w-3xl mx-auto mt-4 mb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs font-semibold mb-4 backdrop-blur-sm shadow-inner">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          Powered by Google Gemini 3
        </div>
        <h1 className="font-extrabold text-3xl sm:text-5xl tracking-tight drop-shadow-md">
          {lang[currentLanguage]?.heading || "AI Movie Assistant"}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
          {lang[currentLanguage]?.subHeading || "Describe your mood, plot, actor, or genre in your own words"}
        </p>
      </div>

      <GptSearchBar />
      <MovieSuggestion />
    </div>
  );
};

export default GptSearchPage;