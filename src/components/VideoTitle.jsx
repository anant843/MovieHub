import { FaCircleInfo } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VideoTitle = ({ title, description, movieId }) => {
  const navigate = useNavigate();

  const handlePlayOrInfo = () => {
    navigate("/browse/view", {
      state: { movieId, title, description },
    });
  };

  return (
    <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-4 sm:left-8 md:left-14 z-20 max-w-xl md:max-w-2xl text-white pointer-events-auto select-none">
      {/* Netflix Top 10 Badge */}
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span className="bg-red-600 text-white text-[10px] md:text-xs font-extrabold px-1.5 py-0.5 rounded shadow">
          TOP 10
        </span>
        <span className="text-gray-200 font-bold text-xs sm:text-sm drop-shadow-md tracking-wide">
          #1 in Movies Today
        </span>
      </div>

      {/* Hero Movie Title */}
      <h1 className="font-black text-3xl sm:text-5xl md:text-6xl drop-shadow-2xl tracking-tight leading-none mb-3 md:mb-4">
        {title}
      </h1>

      {/* Hero Movie Description */}
      <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-lg max-w-lg mb-4 sm:mb-6">
        {description}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayOrInfo}
          className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-6 sm:px-8 py-2 sm:py-2.5 rounded-md transition-all cursor-pointer font-bold text-sm sm:text-base shadow-2xl active:scale-95 hover:scale-105"
        >
          <FaPlay className="text-xs sm:text-sm" />
          <span>Play</span>
        </button>
        <button
          onClick={handlePlayOrInfo}
          className="flex items-center gap-2 bg-neutral-600/70 hover:bg-neutral-600/90 text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-md transition-all cursor-pointer font-bold text-sm sm:text-base shadow-2xl backdrop-blur-md active:scale-95 border border-white/20 hover:scale-105"
        >
          <FaCircleInfo className="text-sm sm:text-base" />
          <span>More Info</span>
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;