import { useSelector } from "react-redux";
import { useTrailor } from "../customHooks/useTrailor";

const VideoBackground = ({ movieId, backdropUrl }) => {
  const trailor = useSelector((store) => store.movies?.trailor);
  useTrailor(movieId);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {trailor?.key ? (
        <iframe
          className="w-full h-full scale-[1.35] md:scale-[1.2] object-cover pointer-events-none opacity-85"
          src={`https://www.youtube.com/embed/${trailor.key}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${trailor.key}&playsinline=1`}
          title="Hero Video Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : backdropUrl ? (
        <img
          src={backdropUrl}
          alt="Hero Backdrop"
          className="w-full h-full object-cover opacity-80 transition-opacity duration-700"
        />
      ) : (
        <div className="w-full h-full bg-neutral-900" />
      )}

      {/* Cinematic Vignette Gradients for Perfect Netflix Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent z-10" />
    </div>
  );
};

export default VideoBackground;