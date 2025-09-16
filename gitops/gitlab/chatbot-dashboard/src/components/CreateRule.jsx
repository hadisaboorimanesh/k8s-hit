import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import AsyncSelect from "react-select/async";

CreateRule.propTypes = {
    onNewRule: PropTypes.func
};

export default function CreateRule(props) {
    const [ruleForm, setRuleForm] = useState({
        name: "",
        condition_id: null
    });
    const [selectedCondition, setSelectedCondition] = useState({
        label: "بدون پیش‌شرط",
        value: ''
    })
    const axiosPrivate = useAxiosPrivate();
    const createRule = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/rule`, ruleForm)
            .then((response) => {
                props.onNewRule(response.data);
            }).catch(console.log);
    }

    const handleFormChange = (value, name) => {
        setRuleForm(prevState => ({...prevState, [name]: value}));
    }

    const loadConditions = async (inputValue) => {
        if (inputValue === "")
            return
        const conditions = [{value: null, label: "بدون پیش‌شرط"}];
        await axiosPrivate.get(`/dashboard/condition/search?name=${inputValue}`).then((response) => {
            response.data.conditions?.map(c => conditions.push({value: c.id, label: c.name}));
        }).catch(console.log)
        return conditions;
    }

    return (
        <form className={"p-4 text-small flex items-center gap-4 bg-slate-100 border"} onSubmit={createRule}>
            <InputField horizontal={true} name={"name"} className={"w-80"}
                        value={ruleForm.name} onChange={handleFormChange}
                        placeholder={"لطفا فقط حروف لاتین"}>نام قانون</InputField>
            <span>پیش‌شرط</span>
            <div className={"w-60"}>
                <AsyncSelect placeholder="پیش‌شرط"
                             cacheOptions
                             onChange={(option) => {
                                 handleFormChange(option.value, 'condition_id')
                                 setSelectedCondition(option)
                             }}
                             value={selectedCondition}
                             loadOptions={loadConditions}/>
            </div>
            <button
                className={"px-4 py-2 h-10 border text-sm bg-orange-700 text-white rounded box-shadow-small"}>افــــزودن
            </button>
        </form>
    );
}