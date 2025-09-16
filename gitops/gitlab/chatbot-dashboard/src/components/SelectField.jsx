import PropTypes from "prop-types";

export default function SelectField({...props}) {
    return (
        <div>
            <label className={"block mb-1 text-gray-600 font-light"}>{props.label}</label>
            <div className={"bg-white border border-gray-300 rounded p-2"}>
                <select onChange={props.onChange}
                        defaultValue={props.defaultValue}
                        name={props.name}
                        className={"outline-0 bg-transparent w-full placeholder-gray-400 " + props.className}>
                    {props.children}
                </select>
            </div>
        </div>
    );
}

SelectField.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.any,
    onChange: PropTypes.func,
    label: PropTypes.string,
    defaultValue: PropTypes.any
}