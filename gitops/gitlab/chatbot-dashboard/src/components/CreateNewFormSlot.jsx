import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import {useState} from "react";
import Select from "react-select";

CreateNewFormSlot.propTypes = {
    formId: PropTypes.number,
    slots: PropTypes.array,
    formSlots: PropTypes.array,
    onNewFormSlot: PropTypes.func
}

export default function CreateNewFormSlot(props) {
    const formId = props.formId;
    const axiosPrivate = useAxiosPrivate()
    const [slot, setSlot] = useState(null);

    const options = props.slots.map(slot => {
        return {value: slot, label: slot.name}
    })

    const addNewFormSlot = () => {
        if(props.formSlots.some(s => s.id === slot.value.id)) {
            alert("Already added that slot");
            return;
        }
        axiosPrivate.post(`/dashboard/form/${formId}/slot`, {
            slot_id: slot.value.id
        }).then(() => {
            props.onNewFormSlot(slot.value)
        }).catch(e => console.log(e))
    }

    return (
        <div className={"p-4 flex items-end gap-4"}>
            <Select className={"w-40"}
                    options={options}
                    value={slot}
                    onChange={(newValue) => {
                        setSlot(newValue)
                    }}
                    defaultValue={options[0]}
                    name={"slot_id"}/>
            <div className={"flex items-center"}>
                <button type={"button"} onClick={addNewFormSlot}
                        className={"bg-white border border-gray-300 p-2.5 rounded flex items-center"}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
            </div>
        </div>
    );
}
