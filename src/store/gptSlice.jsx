import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
    name : "gpt",
    initialState :{
        showGptSearch : false,
        moviesName : null,
        moviesList : null,
    },
    reducers : {
        toggleGptSearch : (state )=>{
            state.showGptSearch = !state.showGptSearch;
        } ,
        addSearchedMovies : (state,action)=>{
            const {moviesName , moviesList } = action.payload;
            state.moviesName = moviesName;
            state.moviesList = moviesList;
        }
    }


});
export const { toggleGptSearch,  addSearchedMovies} = gptSlice.actions;
export default gptSlice.reducer;