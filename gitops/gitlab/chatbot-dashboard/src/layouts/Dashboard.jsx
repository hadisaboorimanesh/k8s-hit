import PropTypes from "prop-types";
import SideNav from "../components/SideNav.jsx";
import chatbot from "chatbotsdk"

chatbot.config.endpoint = `${import.meta.env.VITE_API_BASE_URL}/chatbot/message`
chatbot.config.actionListener = (action, slots) => {
    console.log(`Action ${action} was called!`);
    console.log(`Current Data is: `)
    console.log(slots);
}
chatbot.start();
window.chatbot = chatbot;

export default function DashboardLayout(props) {

    DashboardLayout.propTypes = {
        children: PropTypes.node.isRequired
    }

    return (
        <>
            <SideNav/>
            <div className={"w-full h-screen bg-slate-100 rtl:pr-60 ltr:pl-60 relative"}>
                <div className={"w-full h-screen relative"} id={"content-container"}>
                    <div className={"px-8 py-8"}>
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    )
}