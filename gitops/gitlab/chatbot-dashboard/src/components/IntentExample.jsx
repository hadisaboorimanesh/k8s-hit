import PropTypes from "prop-types";
import DeleteButton from "./DeleteButton.jsx";

IntentExample.propTypes = {
    example: PropTypes.object,
    onDelete: PropTypes.func
};

export default function IntentExample(props) {
    return (
        <div className={"px-4 flex items-center text-gray-700 py-1 bg-slate-200 border"}>
            <DeleteButton onClick={() => {props.onDelete(props.example.id)}}/>
            <span className={""}>{props.example.name}</span>
        </div>
    );
}
