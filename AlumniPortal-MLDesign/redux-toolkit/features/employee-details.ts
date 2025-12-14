// redux-toolkit/features/employee-details.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type InitialState = {
  doj: string;
  empID: string;
  lwd: string;
  name: string;
  title: string;
};

export const initialState: InitialState = {
  doj: "",
  empID: "",
  lwd: "",
  name: "",
  title: "",
};

const employeeDetailsSlice = createSlice({
  name: "employee_details",
  initialState,
  reducers: {
    // accept partial so callers can set any subset safely
    setState: (state, action: PayloadAction<Partial<InitialState>>) => {
      Object.assign(state, action.payload);
    },
    reset: () => initialState,
  },
});

export const { setState, reset } = employeeDetailsSlice.actions;
export default employeeDetailsSlice.reducer;
