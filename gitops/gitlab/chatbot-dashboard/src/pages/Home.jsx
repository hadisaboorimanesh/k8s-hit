import DashboardLayout from "../layouts/Dashboard.jsx";

export default function Home() {

    return (
        <DashboardLayout>
            <div className={"w-full h-full"}>
                <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-thin text-6xl w-full text-center"}>
                    Alpha Reality Chatbot Dashboard
                </div>
            </div>
        </DashboardLayout>
    )
}