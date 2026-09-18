import { createSlice } from "@reduxjs/toolkit";

const initialMyList = (() => {
  try {
    return JSON.parse(localStorage.getItem("gemflix_my_list")) || [];
  } catch {
    return [];
  }
})();

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlayingMovies: null,
    trailor: null,
    PopularMovies: null,
    topRatedMovies: null,
    upComingMovies: null,
    shows: null,
    popularShows: null,
    myList: initialMyList,
  },
  reducers: {
    addNowPlayingMovies: (state, action) => {
      state.nowPlayingMovies = action.payload;
    },
    addTrailor: (state, action) => {
      state.trailor = action.payload;
    },
    addPopularMovies: (state, action) => {
      state.PopularMovies = action.payload;
    },
    addTopRatedMovies: (state, action) => {
      state.topRatedMovies = action.payload;
    },
    addUpcomingMovies: (state, action) => {
      state.upComingMovies = action.payload;
    },
    addshows: (state, action) => {
      state.shows = action.payload;
    },
    addPopularshows: (state, action) => {
      state.popularShows = action.payload;
    },
    toggleMyList: (state, action) => {
      const movie = action.payload;
      if (!movie || !movie.id) return;
      if (!Array.isArray(state.myList)) state.myList = [];
      const index = state.myList.findIndex((m) => m.id === movie.id);
      if (index >= 0) {
        state.myList.splice(index, 1);
      } else {
        state.myList.push(movie);
      }
      try {
        localStorage.setItem("gemflix_my_list", JSON.stringify(state.myList));
      } catch {}
    },
  },
});

export default movieSlice.reducer;
export const {
  addNowPlayingMovies,
  addTrailor,
  addPopularMovies,
  addTopRatedMovies,
  addUpcomingMovies,
  addshows,
  addPopularshows,
  toggleMyList,
} = movieSlice.actions;
