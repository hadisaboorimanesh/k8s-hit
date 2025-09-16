import {useEffect, useState} from "react";
import DashboardLayout from "../layouts/Dashboard.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import IntentComponent from "../components/Intent.jsx";
import CreateIntent from "../components/CreateIntent.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";

const INTENTS_LIST_URL = "/dashboard/intent";
export default function Intent() {
    const [intents, setIntents] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    useEffect(() => {
        axiosPrivate.get(INTENTS_LIST_URL).then((response) => {
            setIntents(response.data.intents);
        });
    }, []);

    const handleNewIntent = (intent) => {
        setIntents(prevState => [intent, ...prevState])
    }

    const deleteIntent = (id) => {
        confirm("آیا از حذف Intent اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/intent/${id}`).then(() => {
                setIntents(currentIntents => {
                    return currentIntents.filter(i => i.id !== id)
                })
                setToast({
                    message: "Intent با موفقیت حذف شد",
                })
            })
        })
    }

    return (
        <DashboardLayout>
            <div className={"text-xl"}>اینتنت‌ها</div>
            <hr className={"mb-4"}/>
            <CreateIntent onNewIntent={handleNewIntent}/>
            {intents.map((intent) => {
                return (<IntentComponent onDeleteIntent={deleteIntent} key={intent.id} intent={intent}/>)
            })}
        </DashboardLayout>
    );
}