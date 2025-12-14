import { createSlice, PayloadAction } from "@reduxjs/toolkit"
//@ts-ignore
import Cookies from "js-cookie";

const employeeLoginState = Cookies.get("employee_login_state");

export type InitialState = {
    email: string
    empID: string
    accountNumber: string
    panNumber: string,
    otp: string | null
}

const initialState: InitialState = employeeLoginState ? JSON.parse(employeeLoginState) : {
    email: "",
    empID: "",
    accountNumber: "",
    panNumber: "",
    otp: null
}

export const employeeLoginStateSlice = createSlice({
    name: "employee_login_state",
    initialState: initialState,
    reducers: {
        setState: (state, action: PayloadAction<InitialState>) => {
            return action.payload
        }
    }
})

export const { setState } = employeeLoginStateSlice.actions;
export { initialState }
export default employeeLoginStateSlice.reducer