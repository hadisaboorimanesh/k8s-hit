import {useEffect, useState} from "react";
import useToast from "../hooks/useToast.js";

export default function Toast() {

    const {toast} = useToast();
    const [show, setShow] = useState(false);
    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        if (firstTime) {
            setFirstTime(false);
            return
        }
        setShow(true);
        setTimeout(() => {
            setShow(false)
        }, 3000);
    }, [toast])

    return (
        <div className={`fixed left-0 bg-slate-700 transition-all p-4 px-8 rounded mb-4 ml-4 `
            + (toast.type === 'error' ? "text-rose-400 " : "text-green-400 ")
            + (show ? "bottom-0" : "-bottom-20")}>
            {toast.message}
        </div>
    )
}