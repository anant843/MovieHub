import { useEffect, useState } from "react";
import { API_OPTIONS, TMDB_BASE } from "../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import MovieChatBot from "./MovieChatBot";
import { FaArrowLeft } from "react-icons/fa";

const MovieViewPage = () => {
  const [trailor, setTrailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, title, description } = location.state || {};

  const getTrailor = async () => {
    if (!movieId) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetch(
        `${TMDB_BASE}/movie/${movieId}/videos?language=en-US`,
        API_OPTIONS
      );
      const json = await data.json();

      const videos = json.results?.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      ) || [];
      const trailorVideo = videos.length ? videos[0] : json.results?.[0];
      setTrailor(trailorVideo);
    } catch (err) {
      console.error("Failed to fetch trailer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrailor();
  }, [movieId]);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Top Bar with Back Button */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => navigate("/browse")}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          <FaArrowLeft />
          <span>Back to Browse</span>
        </button>
        <h1 className="text-base md:text-lg font-bold text-gray-200 truncate max-w-md">
          {title || "Movie Details"}
        </h1>
        <div className="w-24"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Video & Info Section */}
        <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col">
          {loading ? (
            <div className="aspect-video bg-neutral-900 rounded-xl flex items-center justify-center animate-pulse">
              <p className="text-gray-400">Loading trailer...</p>
            </div>
          ) : trailor?.key ? (
            <iframe
              className="aspect-video w-full rounded-xl shadow-2xl"
              src={`https://www.youtube.com/embed/${trailor.key}?autoplay=1&modestbranding=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="aspect-video bg-neutral-900 rounded-xl flex items-center justify-center text-center p-6 border border-neutral-800">
              <p className="text-gray-400 text-base">
                Trailer is not available for this movie right now.
              </p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
              {title}
            </h2>
            <p className="mt-3 text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl">
              {description || "No overview available."}
            </p>
          </div>
        </div>

        {/* AI Companion Sidebar */}
        <MovieChatBot title={title} description={description} />
      </div>
    </div>
  );
};

export default MovieViewPage;