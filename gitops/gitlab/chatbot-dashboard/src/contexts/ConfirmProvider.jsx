import {createContext, useState} from "react";
import PropTypes from "prop-types";
import Confirm from "../components/Confirm.jsx";

const ConfirmContext = createContext({});

export const ConfirmProvider = ({children}) => {
    const [visible, setVisible] = useState(false);
    const [successResolver, setSuccessResolver] = useState();
    const [message, setMessage] = useState("آیا از انجام این کار اطمینان دارید؟");

    const confirm = (message = "آیا از انجام این کار اطمینان دارید؟") => {
        setVisible(true);
        setMessage(message);
        return new Promise((resolve) => {
            setSuccessResolver(() => {
                return resolve;
            });
        })
    }

    const handleConfirm = () => {
        if (successResolver) {
            successResolver();
        }
        setVisible(false);
    }

    const handleReject = () => {
        setVisible(false);
    }

    return (
        <ConfirmContext.Provider value={{visible, confirm}}>
            {children}
            <Confirm message={message}
                     className={visible ? "" : "hidden"} onConfirm={handleConfirm} onReject={handleReject}/>
        </ConfirmContext.Provider>
    )
}

ConfirmProvider.propTypes = {
    children: PropTypes.any
}

export default ConfirmContext;