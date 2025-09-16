import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {useEffect, useState} from "react";
import {faMinus} from "@fortawesome/free-solid-svg-icons/faMinus";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import CreateNewStep from "./CreateNewStep.jsx";
import Step from "./Step.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";
import DeleteButton from "./DeleteButton.jsx";

Rule.propTypes = {
    rule: PropTypes.object,
    onDeleteRule: PropTypes.func
};

export default function Rule(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [steps, setSteps] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const rule = props.rule;
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    const handleNewStep = (step) => {
        setSteps(prev => [...prev, step]);
    }

    const handleDeleteStep = (step) => {
        console.log(step);
        confirm("آیا از حذف Step اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/step`, {
                data: {
                    rule_id: props.rule.id,
                    step_id: step.data.id,
                    step_type: step.type,
                }
            }).then(() => {
                setSteps(currentReplies => {
                    return currentReplies.filter(r => (r.id !== step.data.id && r.type !== step.type))
                })
                setToast({
                    message: "Step با موفقیت حذف شد",
                })
            })
        })
    }

    const ruleSteps = () => {
        if (isExpanded) {
            return <>
                <div className={"p-4 bg-rose-200"}>
                    <span>پیش‌شرط: </span>
                    <span>{rule.condition?.name ?? "بدون پیش‌شرط"}</span>
                </div>
                <CreateNewStep onNewStep={handleNewStep} ruleId={rule.id}/>
                {steps.length > 0
                    ? steps.map((step) => <Step onDeleteStep={handleDeleteStep} step={step}
                                                key={step.type + "_" + step.id}/>)
                    : <div className={"p-4 text-center text-gray-400 bg-slate-200 border"}>No Steps</div>}
            </>
        }
    }

    useEffect(() => {
        if (isExpanded && steps.length === 0) {
            axiosPrivate.get(`/dashboard/rule/${rule.id}`).then((response) => {
                setSteps(response.data.steps ?? []);
            }).catch((e) => console.log(e));
        }

    }, [isExpanded]);

    return (
        <>
            <article className={"p-4 bg-white box-shadow-small rounded border flex"}>
                <DeleteButton onClick={() => {
                    props.onDeleteRule(props.rule)
                }}/>
                <div className={"grow"}>
                    {rule.name}
                </div>
                <div>
                    <button onClick={() => {
                        setIsExpanded(prevState => !prevState)
                    }}>
                        <FontAwesomeIcon icon={isExpanded ? faMinus : faPlus}/>
                    </button>
                </div>
            </article>
            {ruleSteps()}
        </>
    );
}