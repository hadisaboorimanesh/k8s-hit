import PropTypes from "prop-types";
import DeleteButton from "./DeleteButton.jsx";

ResponseReply.propTypes = {
    reply: PropTypes.object,
    onDeleteReply: PropTypes.func,
};

export default function ResponseReply(props) {
    return (
        <div className={"px-4 flex items-center text-gray-700 py-1 bg-slate-200 border"}>
            <DeleteButton onClick={() => {props.onDeleteReply(props.reply)}}/>
            <div>{props.reply.text}</div>
            {props.reply.buttons?.map((b) => {
                return (
                    <button className={"mr-4 px-4 py-1.5 bg-orange-300 rounded"}
                            key={b.action} type={"button"}>{b.title} ({b.payload})</button>
                )
            })}
        </div>
    );
}
