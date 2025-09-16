import {useEffect, useState} from "react";
import DashboardLayout from "../layouts/Dashboard.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import CreateCondition from "../components/CreateCondition.jsx";
import DeleteButton from "../components/DeleteButton.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";

const CONDITIONS_LIST_URL = "/dashboard/condition";
export default function Condition() {
    const [conditions, setConditions] = useState([]);
    const [slots, setSlots] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    useEffect(() => {
        axiosPrivate.get(CONDITIONS_LIST_URL).then((response) => {
            setConditions(response.data.conditions ?? []);
            setSlots(response.data.slots ?? []);
        }).catch((e) => console.log(e));
    }, []);

    const handleNewCondition = (condition) => {
        setConditions(prevState => [condition, ...prevState])
    }

    const handleDeleteCondition = (condition) => {
        confirm("آیا از حذف Condition اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/condition/${condition.id}`).then(() => {
                setConditions(currentConditions => {
                    return currentConditions.filter(c => c.id !== condition.id)
                })
                setToast({
                    message: "Condition با موفقیت حذف شد",
                })
            })
        })
    }

    return (
        <DashboardLayout>
            <div className={"text-xl"}>شرط‌ها</div>
            <hr className={"mb-4"}/>
            <CreateCondition slots={slots} onNewCondition={handleNewCondition}/>
            {conditions?.map((condition) => {
                return (
                    <article key={condition.id} className={"p-4 bg-white box-shadow-small rounded border flex"}>
                        <DeleteButton onClick={() => {handleDeleteCondition(condition)}}/>
                        <div className={"grow"}>
                            {condition.name} ({slots?.find(s => s.id === condition.slot_id)?.name} == {condition.slot_value})
                        </div>
                    </article>)
            })}
        </DashboardLayout>
    );
}