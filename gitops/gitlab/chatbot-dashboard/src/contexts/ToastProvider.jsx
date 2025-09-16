import {createContext, useState} from "react";
import PropTypes from "prop-types";
import Toast from "../components/Toast.jsx";

const ToastContext = createContext({});

export const ToastProvider = ({children}) => {
    const [toast, setToast] = useState({
        message: "default message",
        type: "success"
    });

    const setErrorToast = (error) => {
        setToast({
            message: error.response.data.error,
            type: "error"
        })
    }

    return (
        <ToastContext.Provider value={{toast, setToast, setErrorToast}}>
            {children}
            <Toast/>
        </ToastContext.Provider>
    )
}

ToastProvider.propTypes = {
    children: PropTypes.any
}

export default ToastContext;