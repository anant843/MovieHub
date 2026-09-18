import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, TMDB_BASE } from "../utils/constants";
import {
  addNowPlayingMovies,
  addPopularMovies,
  addPopularshows,
  addshows,
  addTopRatedMovies,
  addUpcomingMovies,
} from "../store/movieSlice";
import {
  MOCK_NOW_PLAYING,
  MOCK_POPULAR,
  MOCK_TOP_RATED,
  MOCK_UPCOMING,
  MOCK_SHOWS,
  MOCK_POPULAR_SHOWS,
} from "../utils/mockData";
import { useEffect } from "react";

// 8 seconds timeout (local proxy answers in ~200ms)
const FETCH_TIMEOUT_MS = 8000;

const fetchWithTimeout = (url, options, ms) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(id)
  );
};

export const useMovieList = () => {
  const {
    nowPlayingMovies,
    PopularMovies,
    topRatedMovies,
    upComingMovies,
    shows,
    popularShows,
  } = useSelector((state) => state.movies);

  const dispatch = useDispatch();

  const fetchAndDispatch = async (url, actionCreator, mockData, label) => {
    try {
      console.log(`[${label}] 🔄 Fetching...`);
      const res = await fetchWithTimeout(url, API_OPTIONS, FETCH_TIMEOUT_MS);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.results?.length) throw new Error("Empty results");
      dispatch(actionCreator(json.results));
      console.log(`[${label}] ✅ Live — ${json.results.length} movies loaded`);
    } catch (err) {
      console.warn(`[${label}] ⚠️ Fallback mock data (${err.message})`);
      dispatch(actionCreator(mockData));
    }
  };

  useEffect(() => {
    if (!nowPlayingMovies)
      fetchAndDispatch(`${TMDB_BASE}/movie/now_playing?page=1`,              addNowPlayingMovies, MOCK_NOW_PLAYING,    "nowPlaying");
    if (!PopularMovies)
      fetchAndDispatch(`${TMDB_BASE}/movie/popular?language=en-US&page=1`,   addPopularMovies,    MOCK_POPULAR,        "popular");
    if (!upComingMovies)
      fetchAndDispatch(`${TMDB_BASE}/movie/upcoming?page=1`,                 addUpcomingMovies,   MOCK_UPCOMING,       "upcoming");
    if (!topRatedMovies)
      fetchAndDispatch(`${TMDB_BASE}/movie/top_rated?language=en-US&page=1`, addTopRatedMovies,   MOCK_TOP_RATED,      "topRated");
    if (!shows)
      fetchAndDispatch(`${TMDB_BASE}/tv/top_rated?language=en-US&page=1`,    addshows,            MOCK_SHOWS,          "shows");
    if (!popularShows)
      fetchAndDispatch(`${TMDB_BASE}/tv/popular?page=1`,                     addPopularshows,     MOCK_POPULAR_SHOWS,  "popularShows");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
