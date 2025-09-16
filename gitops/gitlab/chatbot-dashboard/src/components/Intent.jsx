import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {useEffect, useState} from "react";
import {faMinus} from "@fortawesome/free-solid-svg-icons/faMinus";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import CreateNewExample from "./CreateNewExample.jsx";
import IntentExample from "./IntentExample.jsx";
import useToast from "../hooks/useToast.js";
import useConfirm from "../hooks/useConfirm.js";
import DeleteButton from "./DeleteButton.jsx";

Intent.propTypes = {
    intent: PropTypes.object,
    onDeleteIntent: PropTypes.func
};

export default function Intent(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [examples, setExamples] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const intent = props.intent;
    const {setToast} = useToast();
    const {confirm} = useConfirm();
    const handleNewExample = (example) => {
        setExamples(prev => [example, ...prev]);
    }

    const deleteExample = (id) => {
        confirm("آیا از حذف Example اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/example/${id}`).then(() => {
                setExamples(currentExamples => {
                    return currentExamples.filter(e => e.id !== id)
                })
                setToast({
                    message: "Example با موفقیت حذف شد",
                })
            })
        })
    }

    const intentExamples = () => {
        if (isExpanded) {
            return <>
                <CreateNewExample onNewExample={handleNewExample} intentId={intent.id}/>
                {examples.length > 0
                    ? examples.map((example) => <IntentExample onDelete={deleteExample} example={example}
                                                               key={example.id}/>)
                    : <div className={"p-4 text-center text-gray-400 bg-slate-200 border"}>No Examples</div>}
            </>
        }
    }

    useEffect(() => {
        if (isExpanded && examples.length === 0) {
            axiosPrivate.get(`/dashboard/intent/${intent.id}/example`).then((response) => {
                setExamples(response.data.examples ?? []);
            });
        }

    }, [isExpanded]);

    return (
        <>
            <article className={"p-4 bg-white box-shadow-small rounded border flex"}>
                <DeleteButton onClick={() => props.onDeleteIntent(props.intent.id)}/>
                <div className={"grow"}>
                    {intent.name}
                </div>
                <div>
                    <button onClick={() => {
                        setIsExpanded(prevState => !prevState)
                    }}>
                        <FontAwesomeIcon icon={isExpanded ? faMinus : faPlus}/>
                    </button>
                </div>
            </article>
            {intentExamples()}
        </>
    );
}