import { useSelector } from "react-redux";
import MoviesList from "./MoviesList";
import lang from "../utils/languageConstants";

const MovieSuggestion = () => {
  const { moviesName, moviesList } = useSelector((state) => state.gpt);
  const currentLanguage = useSelector((state) => state.config.language);

  if (!moviesName || !moviesList) return null;

  const hasAnyMovies = moviesList.some((list) => list && list.length > 0);

  return (
    <div className="bg-black/90 text-white mt-8 p-4 rounded-xl max-w-7xl mx-auto">
      <h1 className="text-center md:text-2xl text-xl font-bold text-yellow-500 mb-6">
        {lang[currentLanguage]?.searchHeading || "Recommended Movies for You"}
      </h1>

      {!hasAnyMovies ? (
        <p className="text-center text-gray-400 py-8">
          No matching movies found. Try another prompt!
        </p>
      ) : (
        moviesList.map((movie, index) => {
          if (!movie || movie.length === 0) return null;
          const rowTitle = moviesName[index] || "Top Matches";
          return <MoviesList key={index} title={rowTitle} movies={movie} />;
        })
      )}
    </div>
  );
};

export default MovieSuggestion;