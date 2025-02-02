import { configureStore } from "@reduxjs/toolkit";
import Redux_functions from './Redux_functions'

const store = configureStore({
    reducer: Redux_functions
})

export default store;