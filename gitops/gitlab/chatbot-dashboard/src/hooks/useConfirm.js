import {useContext} from "react";
import ConfirmContext from "../contexts/ConfirmProvider.jsx";

const useConfirm = () => {
    return useContext(ConfirmContext);
}

export default useConfirm;