import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

CreateIntent.propTypes = {
    onNewIntent: PropTypes.func
};

export default function CreateIntent(props) {
    const [name, setName] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const createIntent = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/intent`, {name})
            .then((response) => {
                props.onNewIntent(response.data.intent);
                setName("");
            }).catch((e) => console.log(e))
    }
    return (
        <form className={"p-4 text-small flex gap-4 bg-slate-100 border"} onSubmit={createIntent}>
            <InputField horizontal={true} name={"example"} className={"w-80"}
                        value={name} onChange={setName}
                        placeholder={"Example Content"}>اینتنت جدید</InputField>
            <button
                className={"px-4 py-2 h-10 border text-sm bg-orange-700 text-white rounded box-shadow-small"}>افــــزودن
            </button>
        </form>
    );
}