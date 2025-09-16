import PropTypes from "prop-types";

Confirm.propTypes = {
    onConfirm: PropTypes.func,
    onReject: PropTypes.func,
    className: PropTypes.string,
    message: PropTypes.string
}

export default function Confirm(props) {
    return (
        <div className={"fixed top-0 left-0 w-screen h-screen bg-black/30 z-10 " + props.className}>
            <div className={"absolute w-1/3 -translate-x-1/2 p-4 bg-white rounded shadow-large -translate-y-1/2 top-1/2 left-1/2"}>
                <div className={"mb-4"}>{props.message}</div>
                <div className={"flex gap-8 items-center"}>
                    <button className={"text-green-700"} onClick={() => {
                        props.onConfirm()
                    }}>بله
                    </button>
                    <button className={"text-rose-700"} onClick={() => {
                        props.onReject()
                    }}>خیر
                    </button>
                </div>
            </div>
        </div>
    )
}