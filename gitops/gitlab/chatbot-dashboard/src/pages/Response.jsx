import {useEffect, useState} from "react";
import DashboardLayout from "../layouts/Dashboard.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import ResponseComponent from "../components/Response.jsx";
import CreateResponse from "../components/CreateResponse.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";

const RESPONSES_LIST_URL = "/dashboard/response";

export default function Response() {
    const [responses, setResponses] = useState([]);
    const [intents, setIntents] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    useEffect(() => {
        axiosPrivate.get(RESPONSES_LIST_URL).then((response) => {
            setResponses(response.data.responses);
        });
    }, []);

    useEffect(() => {
        axiosPrivate.get(`/dashboard/intent`).then((response) => {
            setIntents(response.data.intents);
        });
    }, []);

    const handleNewResponse = (response) => {
        setResponses(prevState => [response, ...prevState]);
    };

    const deleteResponse = (id) => {
        confirm("آیا از حذف Response اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/response/${id}`).then(() => {
                setResponses(currentResponses => {
                    return currentResponses.filter(r => r.id !== id);
                });
                setToast({
                    message: "Response با موفقیت حذف شد",
                });
            }).catch((error) => {
                setToast({
                    message: `خطا در حذف Response: ${error.message}`,
                });
            });
        });
    };

    return (
        <DashboardLayout>
            <div className={"text-xl"}>پاسخ‌ها</div>
            <hr className={"mb-4"}/>
            <CreateResponse onNewResponse={handleNewResponse}/>
            {responses.map((response) => {
                return (
                    <ResponseComponent
                        intents={intents}
                        key={response.id}
                        response={response}
                        onDeleteResponse={deleteResponse}
                    />
                );
            })}
        </DashboardLayout>
    );
}
