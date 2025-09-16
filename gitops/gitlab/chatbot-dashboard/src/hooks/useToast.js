import {useContext} from "react";
import ToastContext from "../contexts/ToastProvider.jsx";

const useToast = () => {
    return useContext(ToastContext);
}

export default useToast;