import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type InitialStateData = {
    ticketDisplayNo: string,
    createdOn: string,
    statusName: string,
    classificationName: string,
    lastUpdatedOn: string
}[]
export type InitialState = {
    data: InitialStateData, isLoading: boolean
}

const initialState: InitialState = {
    data: [], isLoading: true
}

export const ticketStatusSlice = createSlice({
    name: "ticket-status",
    initialState: initialState,
    reducers: {
        setState: (state, action: PayloadAction<InitialState>) => {
            return action.payload
        }
    }
})

export const { setState } = ticketStatusSlice.actions;
export { initialState }
export default ticketStatusSlice.reducer