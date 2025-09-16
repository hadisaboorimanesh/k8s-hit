import PropTypes from "prop-types";
import InputField from "./InputField.jsx";
import {useEffect, useState} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import Select from "react-select";

CreateNewReply.propTypes = {
    responseId: PropTypes.number,
    onNewReply: PropTypes.func,
    intents: PropTypes.array,
};

export default function CreateNewReply(props) {
    const responseID = props.responseId
    const [text, setText] = useState("");
    const [buttons, setButtons] = useState([]);
    const [newButton, setNewButton] = useState({
        title: "",
        payload: ""
    });
    const intentOptions = props.intents.map(i => {return {id: i.id, value: `/${i.name}`, label: i.name}});
    const axiosPrivate = useAxiosPrivate();
    const createReply = (e) => {
        e.preventDefault();
        axiosPrivate.post(`/dashboard/response/${responseID}/reply`, {
            text: text,
            buttons: buttons
        }).then((response) => {
            props.onNewReply(response.data.reply);
            setText("");
            setButtons([]);
        })
    }

    const handleNewButtonChange = (value, name) => {
        setNewButton(prevState => ({...prevState, [name]: value}))
    }

    const addNewButton = () => {
        setButtons(prevState => ([...prevState, newButton]))
        setNewButton({title: "", payload: ""});
    }

    useEffect(() => {
        console.log(newButton);
    },[newButton])

    return (
        <form className={"p-4 text-gray-600 text-small bg-slate-100 border"} onSubmit={createReply}>
            <InputField horizontal={true} name={"text"} className={"w-80"}
                        value={text} onChange={setText}
                        placeholder={"متن پاسخ به کاربر"}>متن پاسخ</InputField>
            <div className={"mt-3 flex items-center gap-4"}>
                <div>دکمه‌ها:</div>
                {buttons.map(b => (<button className={"px-4 py-2 bg-orange-300 rounded"}
                                           key={b.payload} type={"button"}>{b.title} ({b.payload})</button>))}
            </div>
            <div className={"mt-2 flex items-end gap-4"}>
                <InputField
                    placeholder={"متن دکمه"}
                    value={newButton.title}
                    name={"title"}
                    onChange={handleNewButtonChange}>
                </InputField>
                <Select onChange={(option) => {handleNewButtonChange(option.value, 'payload')}}
                        value={intentOptions.find(i => `/${i.name}` === newButton.payload)}
                        options={intentOptions}
                        className={"w-44 h-10"}
                        placeholder={"انتخاب intent"}
                />
                <div className={"flex items-center"}>
                    <button type={"button"} onClick={addNewButton}
                            className={"bg-white border border-gray-300 p-3 rounded flex items-center"}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>
            </div>
            <button
                className={"px-4 py-2 h-10 mt-3 border text-sm bg-teal-700 text-white rounded box-shadow-small"}>افــــزودن
            </button>
        </form>
    );
}