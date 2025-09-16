import PropTypes from 'prop-types';
import DeleteButton from "./DeleteButton.jsx";

Action.propTypes = {
    action: PropTypes.object,
    onDeleteAction: PropTypes.func
};

export default function Action(props) {
    const action = props.action;
    return (
        <>
            <article className={"p-4 bg-white box-shadow-small rounded border flex"}>
                <DeleteButton onClick={() => {props.onDeleteAction(props.action)}}/>
                <div className={"grow"}>
                    {action.name}
                </div>
            </article>
        </>
    );
}