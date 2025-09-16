import PropTypes from "prop-types";

export default function InputField({...props}) {
    return (
        <div className={props.horizontal ? "flex items-center gap-4" : ""}>
            <label className={"block mb-1 text-gray-600 font-light"} htmlFor={props.name ?? "form-input-id"}>{props.children}</label>
            <input className={"block border border-gray-300 rounded p-2 outline-0 " + props.className}
                   autoComplete={props.autoComplete ?? "off"}
                   value={props.value}
                   placeholder={props.placeholder}
                   onChange={e => props.onChange(e.target.value, props.name)}
                   id={props.name ?? "form-input-id"}
                   type={props.type ?? "text"}
                   ref={props.forwardRef}
                   required={props.required ?? false}
            />
        </div>
    );
}

InputField.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.any,
    onChange: PropTypes.func,
    className: PropTypes.string,
    forwardRef: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    horizontal: PropTypes.bool
}