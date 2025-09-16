import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink} from "react-router-dom";
import PropTypes from "prop-types";

export default function AsideLink(props) {

    AsideLink.propTypes = {
        children: PropTypes.node.isRequired,
        icon: PropTypes.object,
        to: PropTypes.node.isRequired
    }

    return (
        <NavLink className={({isActive}) => `block flex items-center ${isActive ? '' : 'opacity-50'}`}
                 to={props.to}>
            <FontAwesomeIcon className={"w-6 text-blue-600 ml-4 text-lg"} icon={props.icon}/>
            {props.children}
        </NavLink>
    )
}