import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";
import { TMDB_IMG } from "../utils/constants";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);

  // Shimmer Skeleton Loading State
  if (!movies || movies.length === 0) {
    return (
      <div className="relative h-[75vh] md:h-[85vh] w-full bg-neutral-950 animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900" />
        <div className="absolute bottom-16 left-6 md:left-14 space-y-4 max-w-xl z-20">
          <div className="h-10 md:h-16 w-3/4 bg-neutral-800 rounded-md" />
          <div className="h-4 w-full bg-neutral-800 rounded" />
          <div className="h-4 w-2/3 bg-neutral-800 rounded" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-28 bg-neutral-800 rounded-md" />
            <div className="h-10 w-32 bg-neutral-800 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // First movie as hero banner
  const mainMovie = movies[0];
  const { original_title, title, overview, id, backdrop_path, poster_path } = mainMovie;
  const imagePath = backdrop_path || poster_path;
  const backdropUrl = imagePath ? `${TMDB_IMG}${imagePath}` : null;

  return (
    <div className="relative h-[75vh] sm:h-[80vh] md:h-[88vh] w-full overflow-hidden bg-black select-none">
      <VideoBackground movieId={id} backdropUrl={backdropUrl} />
      <VideoTitle
        title={title || original_title}
        description={overview}
        movieId={id}
      />
    </div>
  );
};

export default MainContainer;
