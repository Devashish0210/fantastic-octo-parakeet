import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type InitialState = {
    data: {
        name: string,
        status: string,
        comment: string
    }[], isLoading: boolean
    extras?: { ffStatus?: string; ffNegativeButSettled?: boolean; lwdDate?: string };
}

const initialState: InitialState = {
    data: [{
        name: "Reporting Manager",
        status: "",
        comment: ""
    }, {
        name: "Finance",
        status: "",
        comment: ""
    }, {
        name: "Admin",
        status: "",
        comment: ""
    }, {
        name: "CIS",
        status: "",
        comment: ""
    }, {

        name: "HRSS",
        status: "",
        comment: ""
    }, {
        name: "Final Settlement",
        status: "",
        comment: "",
    }], isLoading: true,
    extras: undefined,
}

const ndcSlice = createSlice({
  name: "ndc",
  initialState,
  reducers: {
    setState(state, action: PayloadAction<InitialState>) {
      state.isLoading = action.payload.isLoading;
      state.data = action.payload.data;
      state.extras = action.payload.extras; 
    },
  },
});

export const { setState } = ndcSlice.actions;
export { initialState }
export default ndcSlice.reducer