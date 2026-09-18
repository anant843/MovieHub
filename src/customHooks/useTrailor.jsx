import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, TMDB_BASE } from "../utils/constants";
import { addTrailor } from "../store/movieSlice";
import { MOCK_TRAILERS, MOCK_NOW_PLAYING } from "../utils/mockData";
import { useEffect, useRef } from "react";
// TMDB_BASE routes through Vite dev server proxy to bypass ISP DNS sinkhole

export const useTrailor = (movieId) => {
  const trailor = useSelector((store) => store.movies.trailor);
  const dispatch = useDispatch();
  const lastFetchedId = useRef(null);

  const getTrailor = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const data = await fetch(
        `${TMDB_BASE}/movie/${movieId}/videos?language=en-US`,
        { ...API_OPTIONS, signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!data.ok) throw new Error(`HTTP ${data.status}`);
      const json = await data.json();

      if (!json.results?.length) throw new Error("No videos found");

      const videos = json.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      const trailer = videos.length ? videos[0] : json.results[0];
      dispatch(addTrailor(trailer));
      console.log("[trailer] ✅ Live trailer loaded:", trailer.key);
    } catch (err) {
      console.warn("[trailer] ⚠️ API unavailable — using mock trailer");
      // Use mock trailer if available for this movieId, else use first mock
      const mockTrailer =
        MOCK_TRAILERS[movieId] ||
        MOCK_TRAILERS[MOCK_NOW_PLAYING[0]?.id] ||
        Object.values(MOCK_TRAILERS)[0];
      if (mockTrailer) dispatch(addTrailor(mockTrailer));
    }
  };

  useEffect(() => {
    if (movieId && lastFetchedId.current !== movieId) {
      lastFetchedId.current = movieId;
      if (!trailor || trailor._movieId !== movieId) {
        getTrailor();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);
};