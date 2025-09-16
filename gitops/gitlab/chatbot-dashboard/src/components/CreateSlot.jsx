import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import SelectField from "./SelectField.jsx";

CreateSlot.propTypes = {
    onNewSlot: PropTypes.func
};

export default function CreateSlot(props) {
    const [name, setName] = useState("");
    const [localizedName, setLocalizedName] = useState("");
    const [influenceConversation, setInfluenceConversation] = useState(0);
    const [type, setType] = useState("text");
    const axiosPrivate = useAxiosPrivate();

    const createSlot = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/slot`, {
            'name': name,
            'influence_conversation': !!influenceConversation,
            'type': type,
            'localized_name': localizedName
        })
            .then((response) => {
                props.onNewSlot(response.data.slot);
                setName("");
                setInfluenceConversation(0);
                setLocalizedName("");
                setType("text");
            }).catch((e) => console.log(e))
    }

    return (
        <form className={"p-4 text-small flex items-end gap-4 bg-slate-100 border"} onSubmit={createSlot}>
            <InputField name={"name"} className={"w-80"}
                        value={name} onChange={setName}
                        placeholder={"نام لاتین اسلات"}>نام اسلات</InputField>
            <InputField name={"localized_name"} className={"w-80"}
                        value={localizedName} onChange={setLocalizedName}
                        placeholder={"نام فارسی اسلات"}>نام اسلات</InputField>
            <SelectField onChange={(e) => setInfluenceConversation(e.target.value)}
                         className={"w-64"}
                         value={influenceConversation}
                         label={"تاثیر بر گفتگو"}
                         defaultValue={0}
                         name={"influenceConversation"}>
                <option value={0}>ندارد</option>
                <option value={1}>دارد</option>
            </SelectField>
            <SelectField onChange={(e) => setType(e.target.value)}
                         className={"w-64"}
                         value={type}
                         label={"نوع"}
                         defaultValue={"text"}
                         name={"type"}>
                <option value={"text"}>متن</option>
                <option value={"bool"}>Boolean</option>
            </SelectField>
            <div>
                <button
                    className={"px-4 py-2 h-10 border text-sm bg-orange-700 text-white rounded box-shadow-small"}>افــــزودن
                </button>
            </div>
        </form>
    );
}