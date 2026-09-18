import { Link } from "react-router-dom";
import { TMDB_IMG } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { toggleMyList } from "../store/movieSlice";
import { FaPlus, FaCheck, FaStar, FaPlay } from "react-icons/fa";

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();
  const myList = useSelector((state) => state.movies?.myList || []);

  const {
    title,
    backdrop_path,
    poster_path,
    name,
    id,
    overview,
    vote_average,
    release_date,
    first_air_date,
  } = movie;

  const imagePath = backdrop_path || poster_path;
  const isBookmarked = myList.some((m) => m.id === id);

  if (!imagePath) return null;

  const rating = vote_average ? vote_average.toFixed(1) : null;
  const year = (release_date || first_air_date || "").slice(0, 4);

  const handleToggleList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleMyList(movie));
  };

  return (
    <div className="group relative w-36 sm:w-52 md:w-64 text-white shrink-0 transition-transform duration-300">
      <Link
        to="/browse/view"
        state={{ movieId: id, title: title || name, description: overview }}
      >
        <div className="relative overflow-hidden rounded-lg bg-neutral-900 shadow-md group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-neutral-600 transition-all duration-300">
          <img
            src={TMDB_IMG + imagePath}
            alt={title || name}
            loading="lazy"
            className="w-full object-cover aspect-video bg-neutral-900 group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          {/* Rating Badge (Top Left) */}
          {rating && rating !== "0.0" && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[11px] font-semibold text-yellow-400 z-10 shadow">
              <FaStar className="text-[9px]" />
              <span>{rating}</span>
            </div>
          )}

          {/* Year Badge (Top Left if no rating, else beside it) */}
          {year && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {year}
            </div>
          )}

          {/* Center Play Icon Overlay on Hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform pl-0.5">
              <FaPlay className="text-xs" />
            </div>
          </div>

          {/* Bookmark / My List Quick Button (Top Right) */}
          <button
            onClick={handleToggleList}
            title={isBookmarked ? "Remove from My List" : "Add to My List"}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/75 hover:bg-black text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-lg hover:scale-110"
          >
            {isBookmarked ? (
              <FaCheck className="text-green-400 text-xs" />
            ) : (
              <FaPlus className="text-white text-xs" />
            )}
          </button>
        </div>
      </Link>

      <div className="flex items-center justify-between mt-1.5 px-0.5">
        <p className="font-medium text-xs sm:text-sm text-gray-200 truncate flex-1 group-hover:text-white transition-colors">
          {title || name}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;