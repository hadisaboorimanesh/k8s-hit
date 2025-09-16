import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMultiply} from "@fortawesome/free-solid-svg-icons/faMultiply";
import PropTypes from "prop-types";

DeleteButton.propTypes = {
    onClick: PropTypes.func
}

export default function DeleteButton(props) {
    return (
        <button onClick={() => {props.onClick()}} className={"ml-2 text-sm text-rose-600"}>
            <FontAwesomeIcon title={"حذف"} icon={faMultiply}/>
        </button>
    )
}