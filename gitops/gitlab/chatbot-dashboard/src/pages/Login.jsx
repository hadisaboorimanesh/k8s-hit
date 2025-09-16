import GuestLayout from "../layouts/GuestLayout.jsx";
import InputField from "../components/InputField.jsx";
import {useState} from "react";
import axios from "../api/axios.js";
import {useLocation, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {setAuth} = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/login", {email, password})
            .then((response) => {
                setEmail("");
                setPassword("");
                setAuth({user: response.data.user, accessToken: response.data.access_token});
                return navigate(from, {replace: true});
            }).catch((e) => {
            console.log(e);
            if (!e.response) {
                alert("No response from server");
                return;
            }
            if (e.response?.status === 422) {
                alert("Invalid fields");
            }
        });
    }

    return (
        <GuestLayout className={"bg-gradient-to-r from-cyan-500 to-blue-500"}>
            <form onSubmit={handleSubmit} className={"w-1/4 p-6 bg-white text-white box-shadow-sm rounded-sm"}>
                <h1 className={"text-xl text-gray-600 font-semibold mb-10 text-center"}>ورود به داشبــــورد</h1>
                <div className={"mb-2"}>
                    <InputField required placeholder={"ایمیل"} name={"email"} className={"w-full text-gray-600"}
                                value={email} onChange={setEmail}>ایمیل</InputField>
                </div>
                <div className={"my-6"}>
                    <InputField required type={"password"}
                                placeholder={"رمز عبور"} name={"password"} className={"w-full text-gray-600"}
                                value={password} onChange={setPassword}>رمزعبور</InputField>
                </div>
                <div className={"mt-6"}>
                    <button
                        className={"w-full bg-blue-500 p-2.5 rounded shadow-md hover:bg-blue-600 transition-colors"}>ورود
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}