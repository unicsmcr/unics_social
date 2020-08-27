import {createSlice} from "@reduxjs/toolkit";

export const EventsListSlice = createSlice({
    name: "eventsList",
    initialState: [],
    reducers: {
        setEventsList: (state, action) =>{
            state = action.payload
        },
        appendEvent: (state, action) => {
            state.push(action.payload)
        },
        removeEvent: (state, action) => {
            state = state.filter(channel => channel !== action.payload)
        }
    }
})
export const {setChannels, appendEvent, removeEvent} = EventsListSlice.actions
export const selectEventsList = state => state.eventsList
export default EventsListSlice.reducer