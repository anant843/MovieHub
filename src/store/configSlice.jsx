import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
    name: "config",
    initialState:{
        language: "en",
        showNavItems: false,

    },
    reducers:{
        changeLanguage: (state, action)=>{
            state.language = action.payload
        },
        toggleNavItems : (state)=>{
            state.showNavItems = !state.showNavItems

        }
    }
})
export default configSlice.reducer
export const { changeLanguage , toggleNavItems} = configSlice.actions;