import PropTypes from "prop-types";
import DeleteButton from "./DeleteButton.jsx";

Step.propTypes = {
    step: PropTypes.object,
    onDeleteStep: PropTypes.func,
};

export default function Step(props) {
    return (
        <div className={"px-4 text-gray-700 py-1 bg-slate-200 border-t border-slate-300"}>
            <DeleteButton onClick={() => {
                props.onDeleteStep(props.step)
            }}/>
            <span>{props.step.type}: {props.step.data.name} ({props.step.order})</span>
        </div>
    );
}
