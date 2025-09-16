import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

CreateAction.propTypes = {
    onNewAction: PropTypes.func
};

export default function CreateAction(props) {
    const [name, setName] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const createAction = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/action`, {name})
            .then((response) => {
                props.onNewAction(response.data.action);
                setName("");
            }).catch(console.log)
    }
    return (
        <form className={"p-4 text-small flex gap-4 bg-slate-100 border"} onSubmit={createAction}>
            <InputField horizontal={true} name={"example"} className={"w-80"}
                        value={name} onChange={setName}
                        placeholder={"Action's Name"}>اکشن جدید</InputField>
            <button
                className={"px-4 py-2 h-10 border text-sm bg-orange-700 text-white rounded box-shadow-small"}>افــــزودن
            </button>
        </form>
    );
}