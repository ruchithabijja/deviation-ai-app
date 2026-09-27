import { configureStore } from "@reduxjs/toolkit";
import deviationReducer from "../features/deviationSlice";

export const store = configureStore({
    reducer: {
        deviation: deviationReducer
    }
});