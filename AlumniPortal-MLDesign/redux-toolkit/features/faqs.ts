import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type faqsFiles = {
    "filename": string,
    "filepath": string
}[]

export type Faqs = {
    "id": number
    "questions": string
    "answers": string
    "tags": string
    "category": string
    "files": faqsFiles
}[]

const initialState: Faqs = []

export const faqsSlice = createSlice({
    name: "faqs",
    initialState: initialState,
    reducers: {
        setState: (state, action: PayloadAction<Faqs>) => {
            return action.payload
        }
    }
})

export const { setState } = faqsSlice.actions;
export { initialState }
export default faqsSlice.reducer