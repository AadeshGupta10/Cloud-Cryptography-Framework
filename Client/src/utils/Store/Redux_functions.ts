import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    authentication: false,
    isLoading: false,
    username: ''
}

const Redux_functions = createSlice({
    name: "Redux_functions",
    initialState,
    reducers: {
        handleLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        handleAuthentication: (state, action) => {
            state.authentication = action.payload
        },
        changeUsername: (state, action) => {
            state.username = action.payload
        }
    }
})

export const { handleLoading, handleAuthentication, changeUsername } = Redux_functions.actions;

export default Redux_functions.reducer;