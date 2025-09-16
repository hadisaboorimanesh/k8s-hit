import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useToast from "../hooks/useToast.js";

CreateNewExample.propTypes = {
    intentId: PropTypes.number,
    onNewExample: PropTypes.func
};

export default function CreateNewExample(props) {
    const intentID = props.intentId
    const [name, setName] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const {setToast} = useToast();

    const createExample = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/intent/${intentID}/example`, {name})
            .then((response) => {
                props.onNewExample(response.data.example);
                setName("");
                setToast({
                    message: "Example با موفقیت ثبت شد"
                })
            });
    }
    return (
        <form className={"p-4 text-small flex gap-4 bg-slate-100 border"} onSubmit={createExample}>
            <InputField horizontal={true} name={"example"} className={"w-80"}
                        value={name} onChange={setName}
                        placeholder={"Example Content"}>مثال جدید</InputField>
            <button
                className={"px-4 py-2 h-10 border text-sm bg-teal-700 text-white rounded box-shadow-small"}>افــــزودن
            </button>
        </form>
    );
}