import { useRef, useState } from "react";
import MovieCard from "./MovieCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MoviesList = ({ title, movies }) => {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  if (!movies || movies.length === 0) return null;

  const handleScroll = () => {
    if (sliderRef.current) {
      setShowLeftArrow(sliderRef.current.scrollLeft > 20);
    }
  };

  const slide = (direction) => {
    if (sliderRef.current) {
      const offset = direction === "left" ? -600 : 600;
      sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="group/row relative px-4 md:px-12 my-6">
      <h2 className="text-white text-lg md:text-2xl font-bold mb-3 tracking-wide drop-shadow">
        {title}
      </h2>

      <div className="relative">
        {/* Left Scroll Button */}
        {showLeftArrow && (
          <button
            onClick={() => slide("left")}
            aria-label="Scroll left"
            className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-200 cursor-pointer shadow-2xl hover:scale-110 border border-neutral-700 backdrop-blur-sm hidden sm:flex items-center justify-center"
          >
            <FaChevronLeft className="text-sm md:text-base" />
          </button>
        )}

        {/* Movie Row Slider */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-scroll overflow-y-hidden scrollbar-hide space-x-2 scroll-smooth py-2"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => slide("right")}
          aria-label="Scroll right"
          className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-200 cursor-pointer shadow-2xl hover:scale-110 border border-neutral-700 backdrop-blur-sm hidden sm:flex items-center justify-center"
        >
          <FaChevronRight className="text-sm md:text-base" />
        </button>
      </div>
    </div>
  );
};

export default MoviesList;