import { InitialState } from "@/redux-toolkit/features/employee-login-state";
import axios from "axios";
import handleLogout from "./LogOut";
import { AppDispatch } from "@/redux-toolkit/store";

const RequestDocument = async (item: string, employeeLoginState: InitialState, dispatch: AppDispatch, router: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/alumni/doc-request`, {
      "document_type": item
    }, {
      headers: {
        'X-EMAIL': employeeLoginState.email,
        'X-ALUMNIOTP': employeeLoginState.otp,
        'X-EMPID': employeeLoginState.empID
      }
    });
    if (response.status === 403) {
      handleLogout(dispatch, router)
      return
    }
    if (response.status === 201) {
      // console.log(response.data)
      return true
    }
    else {
      return false
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.status === 403) {
        handleLogout(dispatch, router)
      } else {
        console.log(err)
      }
    } else {
      console.log(err)
    }
    return false;
  }
};
export default RequestDocument;
