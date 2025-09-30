import { createSlice } from "@reduxjs/toolkit";
import data from "@data/location.json"

const initialState = {
    locations: data,
    selectedIndex: null,
    goToLocation: {
        latitude: null,
        longitude: null
    }
};


const locationSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
        updateLocations(state, { payload }) {
            state.locations = payload
        },
        updateSelectedIndex(state, { payload }) {
            state.selectedIndex = payload
        },
        updateGoTo(state, { payload }) {
            state.goToLocation.latitude = payload.latitude;
            state.goToLocation.longitude = payload.longitude;
        }
    }
})


export const { updateLocations, updateSelectedIndex, updateGoTo } = locationSlice.actions;
export default locationSlice.reducer;