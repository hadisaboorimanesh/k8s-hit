import PropTypes from "prop-types";
import DeleteButton from "./DeleteButton.jsx";

FormSlot.propTypes = {
    slot: PropTypes.object,
    onDelete: PropTypes.func
}

export default function FormSlot(props) {
    return (
        <div className={"bg-gray-800 text-white p-2 px-4 rounded flex items-center"}>
            <DeleteButton onClick={() => {props.onDelete(props.slot)}}/>
            <div>{props.slot.name}</div>
        </div>
    )
}