import {useEffect, useState} from "react";
import DashboardLayout from "../layouts/Dashboard.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import CreateSlot from "../components/CreateSlot.jsx";
import DeleteButton from "../components/DeleteButton.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";

const SLOTS_LIST_URL = "/dashboard/slot";
export default function Slot() {
    const [slots, setSlots] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    useEffect(() => {
        axiosPrivate.get(SLOTS_LIST_URL).then((response) => {
            setSlots(response.data.slots);
        }).catch((e) => console.log(e));
    }, []);

    const handleNewSlot = (slot) => {
        setSlots(prevState => [slot, ...prevState])
    }

    const deleteSlot = (slot) => {
        confirm("آیا از حذف Slot اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/slot/${slot.id}`).then(() => {
                setSlots(currentSlots => {
                    return currentSlots.filter(s => s.id !== slot.id)
                })
                setToast({
                    message: "Slot با موفقیت حذف شد",
                })
            })
        })
    }

    return (
        <DashboardLayout>
            <div className={"text-xl"}>اسلات‌ها</div>
            <hr className={"mb-4"}/>
            <CreateSlot onNewSlot={handleNewSlot}/>
            {slots.map((slot) => {
                return (
                    <article key={slot.id} className={"p-4 bg-white box-shadow-small rounded border flex"}>
                        <DeleteButton onClick={() => deleteSlot(slot)}/>
                        <div className={"grow"}>
                            {slot.name} ({slot.localized_name}) - {slot.type}
                        </div>
                    </article>)
            })}
        </DashboardLayout>
    );
}