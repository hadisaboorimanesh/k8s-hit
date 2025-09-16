import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons/faMinus";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import CreateNewFormSlot from "./CreateNewFormSlot.jsx";
import FormSlot from "./FormSlot.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";
import DeleteButton from "./DeleteButton.jsx";

FormDetails.propTypes = {
    form: PropTypes.object,
    slots: PropTypes.array,
    onDeleteForm: PropTypes.func
};

export default function FormDetails(props) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [formSlots, setFormSlots] = useState([]);
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        if (isExpanded && formSlots.length === 0) {
            axiosPrivate.get(`/dashboard/form/${props.form.id}/slot`).then((response) => {
                setFormSlots(response.data.slots)
            });
        }
    }, [isExpanded]);

    const handleNewFormSlot = (slot) => {
        setFormSlots(prev => [slot, ...prev]);
    }

    const handleDeleteFormSlot = (slot) => {
        confirm("آیا از حذف Slot اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/form/${props.form.id}/slot/${slot.id}`).then(() => {
                setFormSlots(currentSlots => {
                    return currentSlots.filter(s => s.id !== slot.id)
                })
                setToast({
                    message: "Slot با موفقیت حذف شد",
                })
            })
        })
    }

    const renderFormSlots = () => {
        if (isExpanded) {
            return <>
                <CreateNewFormSlot onNewFormSlot={handleNewFormSlot}
                                   formSlots={formSlots}
                                   formId={props.form.id} slots={props.slots}/>
                {formSlots.length > 0
                    ?
                    <>
                        <div className={"mb-2"}>ورودی‌های فرم:</div>
                        <div className={"flex items-center bg-gray-200 rounded gap-4 p-2"}>
                            {formSlots.map((slot) => <FormSlot onDelete={handleDeleteFormSlot} slot={slot} key={slot.id}/>)}
                        </div>
                        <div className={"bg-gray-200"}>validation action name: <span className={"font-bold"}>validate_{props.form.name}</span></div>
                    </>
                    :
                    <div className={"p-4 text-center text-gray-400 bg-slate-200 border"}>No Form Slots</div>}
            </>
        }
    }

    return (
        <>
            <article key={props.form.id} className={"p-4 bg-white box-shadow-small rounded border flex"}>
                <DeleteButton onClick={() => {props.onDeleteForm(props.form)}}/>
                <div className={"grow"}>
                    {props.form.name}
                </div>
                <div>
                    <button onClick={() => {
                        setIsExpanded(prevState => !prevState)
                    }}>
                        <FontAwesomeIcon icon={isExpanded ? faMinus : faPlus}/>
                    </button>
                </div>
            </article>
            {renderFormSlots()}
        </>
    );
}