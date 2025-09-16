import PropTypes from "prop-types";

export default function GuestLayout(props) {

    GuestLayout.propTypes = {
        children: PropTypes.node.isRequired,
        className: PropTypes.string
    }

    return (
        <div className={"w-full h-screen flex items-center justify-center " + props.className}>
            {props.children}
        </div>
    )
}