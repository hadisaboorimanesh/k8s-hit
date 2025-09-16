import {useEffect, useState} from "react";
import DashboardLayout from "../layouts/Dashboard.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import ActionComponent from "../components/Action.jsx";
import CreateAction from "../components/CreateAction.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";

const ACTIONS_LIST_URL = "/dashboard/action";
export default function Action() {
    const [actions, setActions] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    useEffect(() => {
        axiosPrivate.get(ACTIONS_LIST_URL).then((response) => {
            setActions(response.data.actions);
        }).catch((e) => console.log(e));
    }, []);

    const handleNewAction = (action) => {
        setActions(prevState => [action, ...prevState])
    }

    const handleDeleteAction = (action) => {
        confirm("آیا از حذف Action اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/action/${action.id}`).then(() => {
                setActions(currentActions => {
                    return currentActions.filter(a => a.id !== action.id)
                })
                setToast({
                    message: "Action با موفقیت حذف شد",
                })
            })
        })
    }

    return (
        <DashboardLayout>
            <div className={"text-xl"}>اکشن‌ها</div>
            <hr className={"mb-4"}/>
            <CreateAction onNewAction={handleNewAction}/>
            {actions.map((action) => {
                return (<ActionComponent onDeleteAction={handleDeleteAction} key={action.id} action={action}/>)
            })}
        </DashboardLayout>
    );
}