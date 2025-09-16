import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {useEffect, useState} from "react";
import {faMinus} from "@fortawesome/free-solid-svg-icons/faMinus";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import CreateNewReply from "./CreateNewReply.jsx";
import ResponseReply from "./ResponseReply.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";
import DeleteButton from "./DeleteButton.jsx";


Response.propTypes = {
    response: PropTypes.object,
    intents: PropTypes.array,
    onDeleteResponse: PropTypes.func
};

export default function Response(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [replies, setReplies] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const response = props.response;
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    const handleNewReply = (reply) => {
        setReplies(prev => [reply, ...prev]);
    }

    const handleDeleteReply = (reply) => {
        confirm("آیا از حذف Reply اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/reply/${reply.id}`).then(() => {
                setReplies(currentReplies => {
                    return currentReplies.filter(r => r.id !== reply.id)
                })
                setToast({
                    message: "Condition با موفقیت حذف شد",
                })
            })
        })
    }

    const responseReplies = () => {
        if (isExpanded) {
            return <>
                <CreateNewReply intents={props.intents} onNewReply={handleNewReply} responseId={response.id}/>
                {replies.length > 0
                    ? replies.map((reply) => <ResponseReply onDeleteReply={handleDeleteReply} reply={reply} key={reply.id}/>)
                    : <div className={"p-4 text-center text-gray-400 bg-slate-200 border"}>No Replies</div>}
            </>
        }
    }

    useEffect(() => {
        if (isExpanded && replies.length === 0) {
            axiosPrivate.get(`/dashboard/response/${response.id}/reply`).then((response) => {
                setReplies(response.data.replies ?? []);
            }).catch((e) => console.log(e));
        }

    }, [isExpanded]);

    return (
        <>
            <article className={"p-4 bg-white box-shadow-small rounded border flex"}>
                <DeleteButton onClick={() => props.onDeleteResponse(props.response.id)}/>
                <div className={"grow"}>
                    {response.name}
                </div>
                <div>
                    <button onClick={() => {
                        setIsExpanded(prevState => !prevState)
                    }}>
                        <FontAwesomeIcon icon={isExpanded ? faMinus : faPlus}/>
                    </button>
                </div>
            </article>
            {responseReplies()}
        </>
    );
}