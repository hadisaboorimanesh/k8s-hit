import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import Select from "react-select";
import AsyncSelect from "react-select/async";

CreateNewStep.propTypes = {
    ruleId: PropTypes.number,
    onNewStep: PropTypes.func
};

export default function CreateNewStep(props) {
    const ruleID = props.ruleId

    const typeOptions = [
        {value: "intent", label: "Intent"},
        {value: "response", label: "Response"},
        {value: "action", label: "Action"},
        {value: "form", label: "Form"},
    ]

    const [type, setType] = useState(typeOptions[0]);
    const [step, setStep] = useState(null);
    const [order, setOrder] = useState("0");
    const axiosPrivate = useAxiosPrivate();

    const createStep = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/rule/${ruleID}/step`, {
            step_id: step.value,
            step_type: type.value,
            order: parseInt(order),
        }).then(() => {
            props.onNewStep({
                order: order,
                type: type.value,
                data: {
                    id: step.value,
                    name: step.label
                }
            });
            setStep(null);
        }).catch(console.log)
    }

    const loadPossibleSteps = async (keyword) => {
        const steps = [];
        await axiosPrivate.get(`/dashboard/${type.value}/search?name=${keyword}`).then((response) => {
            response.data.map(c => steps.push({value: c.id, label: c.name}));
        }).catch(console.log)
        return steps;
    }
    return (

        <form className={"p-4 text-small flex items-center gap-4 bg-slate-100 border"} onSubmit={createStep}>
            <Select
                className={"w-60"}
                placeholder={"نوع مرحله"}
                options={typeOptions}
                value={type}
                onChange={setType}
            />
            <AsyncSelect
                className={"w-80"}
                placeholder={"انتخاب مرحله"}
                onChange={setStep}
                value={step}
                loadOptions={loadPossibleSteps}
            />
            <InputField
                type={"number"}
                className={"w-14"}
                value={order}
                onChange={(value) => setOrder(value)}
            />
            <button
                className={"px-4 py-2 h-10 border text-sm bg-teal-700 text-white rounded box-shadow-small"}>افــــزودن
            </button>
        </form>
    );
}