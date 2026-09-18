import { useSelector } from "react-redux";
import MoviesList from "./MoviesList";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  const myList = useSelector((store) => store.movies?.myList);

  return (
    <div className="relative z-20 -mt-8 sm:-mt-12 md:-mt-16 pb-20 space-y-4 md:space-y-6 bg-gradient-to-b from-transparent via-black to-black">
      {/* My List Section */}
      <div id="my-list" className="scroll-mt-24 pt-2">
        {myList && myList.length > 0 && (
          <MoviesList title={"⭐ My List"} movies={myList} />
        )}
      </div>

      {/* Movies Section */}
      <div id="movies-section" className="scroll-mt-24">
        <MoviesList title={"Now Playing in Theatres"} movies={movies?.nowPlayingMovies} />
        <MoviesList title={"Top Rated Masterpieces"} movies={movies?.topRatedMovies} />
        <MoviesList title={"Popular Movies"} movies={movies?.PopularMovies} />
        <MoviesList title={"Upcoming Anticipated Releases"} movies={movies?.upComingMovies} />
      </div>

      {/* TV Shows Section */}
      <div id="tv-shows" className="scroll-mt-24">
        <MoviesList title={"Trending TV Shows"} movies={movies?.shows} />
        <MoviesList title={"Popular Binge-Worthy Shows"} movies={movies?.popularShows} />
      </div>
    </div>
  );
};

export default SecondaryContainer;