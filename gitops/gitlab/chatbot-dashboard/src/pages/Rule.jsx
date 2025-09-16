import {useEffect, useState} from "react";
import DashboardLayout from "../layouts/Dashboard.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import CreateRule from "../components/CreateRule.jsx";
import RuleComponent from "../components/Rule.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";

const RULES_LIST_URL = "/dashboard/rule";
export default function Rule() {
    const [rules, setRules] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    useEffect(() => {
        axiosPrivate.get(RULES_LIST_URL).then((response) => {
            setRules(response.data.rules ?? []);
        }).catch((e) => console.log(e));
    }, []);

    const handleNewRule = (rule) => {
        setRules(prevState => [rule, ...prevState])
    }

    const handleDeleteRule = (rule) => {
        confirm("آیا از حذف Rule اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/rule/${rule.id}`).then(() => {
                setRules(currentRules => {
                    return currentRules.filter(r => r.id !== rule.id)
                })
                setToast({
                    message: "Rule با موفقیت حذف شد",
                })
            })
        })
    }

    return (
        <DashboardLayout>
            <div className={"text-xl"}>قوانین</div>
            <hr className={"mb-4"}/>

            <CreateRule onNewRule={handleNewRule}/>
            {rules?.map((rule) => {
                return (<RuleComponent onDeleteRule={handleDeleteRule} key={rule.id} rule={rule}/>)
            })}
        </DashboardLayout>
    );
}