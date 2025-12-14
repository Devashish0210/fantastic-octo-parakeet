import { createSlice, PayloadAction } from "@reduxjs/toolkit"
//@ts-ignore
import Cookies from "js-cookie";

const employerLoginState = Cookies.get("employer-login-state");

export type InitialState = {
    email: string
    otp: string | null
}

const initialState: InitialState = employerLoginState ? JSON.parse(employerLoginState) : {
    email: "",
    otp: null
}

export const employerLoginStateSlice = createSlice({
    name: "employer-login-state",
    initialState: initialState,
    reducers: {
        setState: (state, action: PayloadAction<InitialState>) => {
            return action.payload
        }
    }
})

export const { setState } = employerLoginStateSlice.actions;
export { initialState }
export default employerLoginStateSlice.reducer