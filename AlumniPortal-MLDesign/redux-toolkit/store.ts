import { EnhancedStore, configureStore } from "@reduxjs/toolkit";
import themeSelectorReducer from "@/redux-toolkit/features/theme-selector";
import faqReducer from "@/redux-toolkit/features/faqs";
import employeeLoginStateReducer from "./features/employee-login-state";
import employerLoginStateReducer from "./features/employer-login-state";
import ndcReducer from "./features/ndc";
import employeeDetailsReducer from "./features/employee-details";
import ticketStatusReducer from "./features/ticket-status";
import ticketCreateReducer from "./features/create-ticket";

export const store = configureStore({
  reducer: {
    theme: themeSelectorReducer,
    faqs: faqReducer,
    employeeLoginState: employeeLoginStateReducer,
    employerLoginState: employerLoginStateReducer,
    ndc: ndcReducer,
    employeeDetails: employeeDetailsReducer,
    ticketStatus: ticketStatusReducer,
    ticketCreate: ticketCreateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
