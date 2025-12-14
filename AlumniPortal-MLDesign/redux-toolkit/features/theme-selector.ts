import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  theme: "default"
  mode: "light" | "dark"
};

const initialState = {
  theme: "default",
  mode: "light"
} as InitialState;

export const themeSelector = createSlice({
  name: "theme-selector",
  initialState,
  reducers: {
    // you get access to state and action, type is PayloadAction
    toggleTheme: (state) => {
        state.mode = state.mode === "light" ? "dark" : "light"
    },
    darkTheme: (state) =>{
        state.mode = "dark"
    },
    lightTheme: (state) => {
        state.mode = "light"
    },
    setTheme: (state, action: PayloadAction<InitialState["theme"]> )=>{
      state.theme = action.payload
    }
  },
});

export const { toggleTheme, darkTheme, lightTheme , setTheme } = themeSelector.actions;
export default themeSelector.reducer;