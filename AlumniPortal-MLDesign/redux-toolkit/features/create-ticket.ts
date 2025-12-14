import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type InitialState = {
    data: Object, isLoading: boolean
}

const initialState: InitialState = {
    isLoading: true, data: {}
}

export const ticketCreateSlice = createSlice({
    name: "ticket-create",
    initialState: initialState,
    reducers: {
        setState: (state, action: PayloadAction<InitialState>) => {
            return action.payload
        }
    }
})

export const { setState } = ticketCreateSlice.actions;
export { initialState }
export default ticketCreateSlice.reducer