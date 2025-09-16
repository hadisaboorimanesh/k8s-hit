import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import Select from "react-select";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

CreateCondition.propTypes = {
    onNewCondition: PropTypes.func,
    slots: PropTypes.array
}

export default function CreateCondition(props) {

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [conditionForm, setConditionForm] = useState({
        name: "",
        slot_id: "",
        slot_value: ""
    });

    const axiosPrivate = useAxiosPrivate();

    const options = props.slots.map(slot => {
        return {value: slot, label: slot.name}
    })

    const slotValueOptions = [
        {value: "true", label: "true"},
        {value: "false", label: "false"},
        {value: "none", label: "none"}
    ]

    const handleChange = (value, name) => {
        setConditionForm(prevState => ({...prevState, [name]: value}));
    }

    const createCondition = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/condition`, conditionForm)
            .then((response) => {
                props.onNewCondition(response.data.condition)
                setConditionForm({name: "", slot_id: "", slot_value: ""});
            })
            .catch(console.log);
    }

    return (
        <form className={"p-4 text-small flex items-end gap-4 bg-slate-100 border"} onSubmit={createCondition}>
            <InputField name={"name"} className={"w-80"}
                        value={conditionForm.name} onChange={handleChange}
                        placeholder={"نام شرط"}>نام شرط</InputField>
            <Select className={"w-40"}
                    options={options}
                    value={options?.find(o => o.value === conditionForm.slot_id)}
                    placeholder={"انتخاب اسلات"}
                    onChange={(option) => {
                        handleChange(option.value.id, 'slot_id')
                        setSelectedSlot(option.value);
                    }}/>
            {
                selectedSlot?.type !== 'bool'
                    ? <InputField name={"slot_value"} className={"w-80"}
                                  value={conditionForm.slot_value} onChange={handleChange}
                                  placeholder={"مقدار اسلات"}>مقدار اسلات</InputField>
                    : <Select className={"w-40"}
                              options={slotValueOptions}
                              value={slotValueOptions.find(o => o.value === conditionForm.slot_value)}
                              onChange={(option) => {
                                  handleChange(option.value, 'slot_value')
                              }}/>
            }

            <div>
                <button
                    className={"px-4 py-2 h-10 border text-sm bg-orange-700 text-white rounded box-shadow-small"}>افــــزودن
                </button>
            </div>
        </form>
    )
}