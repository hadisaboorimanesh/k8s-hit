import logo from "../assets/logo.svg";
import AsideLink from "./AsideLink.jsx";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faBookmark, faFolder} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";
import {faMessage} from "@fortawesome/free-regular-svg-icons/faMessage";
import {faInbox} from "@fortawesome/free-solid-svg-icons/faInbox";
import {faQuestionCircle} from "@fortawesome/free-regular-svg-icons/faQuestionCircle";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons/faExclamationCircle";
import {faCogs} from "@fortawesome/free-solid-svg-icons/faCogs";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import useConfirm from "../hooks/useConfirm.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useToast from "../hooks/useToast.js";

export default function SideNav() {
    const {setAuth} = useAuth();
    const navigate = useNavigate();
    const {confirm} = useConfirm();
    const axiosPrivate = useAxiosPrivate();
    const {setToast} = useToast();
    const logout = () => {
        axios.post("/logout").then(() => {
            setAuth({});
            navigate("/login");
        }).catch(console.log);
    }

    const train = () => {
        confirm("آیا از بازسازی مجدد مدل اطمینان دارید؟").then(() => {
            axiosPrivate.get(`/dashboard/train`).then((response) => {
                setToast({
                    message: response.data.message
                })
            })
        })
    }

    return (
        <aside className={"h-screen fixed w-60 px-4 py-8 z-10 bg-white border-l border-slate-200"}>
            <div className={"flex flex-col h-full"}>
                <img className={"mx-auto w-3/4"} src={logo}/>
                <div className={"mt-20 grow px-4 text-gray-800 text-sm space-y-10"}>
                    <AsideLink to={"/dashboard"} icon={faGithub}>داشبــورد</AsideLink>
                    <AsideLink to={"/intent"} icon={faFolder}>اینتنت</AsideLink>
                    <AsideLink to={"/slot"} icon={faBookmark}>اسلات</AsideLink>
                    <AsideLink to={"/response"} icon={faMessage}>پاسخ</AsideLink>
                    <AsideLink to={"/form"} icon={faInbox}>فرم‌ها</AsideLink>
                    <AsideLink to={"/action"} icon={faCogs}>اکشن‌ها</AsideLink>
                    <AsideLink to={"/condition"} icon={faQuestionCircle}>شرط‌ها</AsideLink>
                    <AsideLink to={"/rule"} icon={faExclamationCircle}>قوانین</AsideLink>
                </div>
                <div className={"px-4"}>
                    <button onClick={train} className={'block flex items-center mb-10'}>
                        <FontAwesomeIcon icon={faCog} className={"w-6 text-blue-600 ml-4 text-lg"}/>
                        <span className={"text-gray-800 text-sm"}>بازسازی مدل</span>
                    </button>
                    <button onClick={logout} className={`block flex items-center`}>
                        <FontAwesomeIcon className={"w-6 text-blue-600 ml-4 text-lg"} icon={faRightFromBracket}/>
                        <span className={"text-gray-800 text-sm"}>خروج</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}