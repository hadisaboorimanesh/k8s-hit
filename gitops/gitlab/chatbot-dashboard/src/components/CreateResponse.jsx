import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

CreateResponse.propTypes = {
    onNewResponse: PropTypes.func
};

export default function CreateResponse(props) {
    const [name, setName] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const createResponse = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/response`, {name})
            .then((response) => {
                props.onNewResponse(response.data.response);
                setName("");
            }).catch((e) => console.log(e))
    }
    return (
        <form className={"p-4 text-small flex gap-4 bg-slate-100 border"} onSubmit={createResponse}>
            <InputField horizontal={true} name={"name"} className={"w-80"}
                        value={name} onChange={setName}
                        placeholder={"لطفا فقط حروف لاتین"}>پاسخ جدید</InputField>
            <button
                className={"px-4 py-2 h-10 border text-sm bg-orange-700 text-white rounded box-shadow-small"}>افــــزودن
            </button>
        </form>
    );
}