
import sendEmailToServer from "./SendEmail";
import { toast } from "react-toastify";
const handleSecondButtonClick = async ({
    setupdateddisabled,
    setClickCount,
    setReSendLoading,
    setReSendMessage,
    email
}: {
    setupdateddisabled: React.Dispatch<React.SetStateAction<boolean>>,
    setClickCount: React.Dispatch<React.SetStateAction<number>>,
    setReSendLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setReSendMessage: React.Dispatch<React.SetStateAction<number>>,
    email: string
}) => {
    setReSendLoading(true)
    const handleResend = async () => {
        const res = await sendEmailToServer(email);
        if (res) {
            setClickCount((prevCount) => prevCount + 1);
            setReSendMessage(0);
        } else {
            setReSendMessage(1);
        }
        setReSendLoading(false)
    }
    handleResend()
};

export default handleSecondButtonClick;
