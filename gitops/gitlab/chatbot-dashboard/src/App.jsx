import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Intent from "./pages/Intent.jsx";
import Login from "./pages/Login.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireGuest from "./components/RequireGuest.jsx";
import PersistLogin from "./components/PersistLogin.jsx";
import Slot from "./pages/Slot.jsx";
import Response from "./pages/Response.jsx";
import Form from "./pages/Form.jsx";
import Condition from "./pages/Condition.jsx";
import Rule from "./pages/Rule.jsx";
import Action from "./pages/Action.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route element={<PersistLogin/>}>
                    <Route element={<RequireGuest/>}>
                        <Route path="/login" element={<Login/>}></Route>
                    </Route>
                    <Route element={<RequireAuth/>}>
                        <Route path="/" element={<Home/>}></Route>
                        <Route path="/dashboard" element={<Home/>}></Route>
                        <Route path="/intent" element={<Intent/>}></Route>
                        <Route path="/slot" element={<Slot/>}></Route>
                        <Route path="/response" element={<Response/>}></Route>
                        <Route path="/form" element={<Form/>}></Route>
                        <Route path="/condition" element={<Condition/>}></Route>
                        <Route path="/rule" element={<Rule/>}></Route>
                        <Route path="/action" element={<Action/>}></Route>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App
