import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

CreateForm.propTypes = {
    onNewForm: PropTypes.func
};

export default function CreateForm(props) {
    const [name, setName] = useState("");
    const axiosPrivate = useAxiosPrivate();

    const createForm = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/form`, {name})
            .then((response) => {
                props.onNewForm(response.data.form);
                setName("");
            }).catch((e) => console.log(e))
    }

    return (
        <form className={"p-4 text-small flex items-end gap-4 bg-slate-100 border"} onSubmit={createForm}>
            <InputField name={"name"} className={"w-80"}
                        value={name} onChange={setName}
                        placeholder={"نام فرم"}>نام فرم</InputField>
            <div>
                <button
                    className={"px-4 py-2 h-10 border text-sm bg-orange-700 text-white rounded box-shadow-small"}>افــــزودن
                </button>
            </div>
        </form>
    );
}