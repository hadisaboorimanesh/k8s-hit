import {useEffect, useState} from "react";
import DashboardLayout from "../layouts/Dashboard.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import CreateForm from "../components/CreateForm.jsx";
import FormDetails from "../components/FormDetails.jsx";
import useConfirm from "../hooks/useConfirm.js";
import useToast from "../hooks/useToast.js";

const FORMS_LIST_URL = "/dashboard/form";
export default function Form() {
    const [forms, setForms] = useState([]);
    const [slots, setSlots] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const {confirm} = useConfirm();
    const {setToast} = useToast();

    useEffect(() => {
        axiosPrivate.get(FORMS_LIST_URL).then((response) => {
            setForms(response.data.forms);
            setSlots(response.data.slots);
        }).catch((e) => console.log(e));
    }, []);

    const handleNewForm = (form) => {
        setForms(prevState => [form, ...prevState])
    }

    const handleDeleteForm = (form) => {
        confirm("آیا از حذف Form اطمینان دارید؟").then(() => {
            axiosPrivate.delete(`/dashboard/form/${form.id}`).then(() => {
                setForms(currentForms => {
                    return currentForms.filter(f => f.id !== form.id)
                })
                setToast({
                    message: "Form با موفقیت حذف شد",
                })
            })
        })
    }

    return (
        <DashboardLayout>
            <div className={"text-xl"}>فرم‌ها</div>
            <hr className={"mb-4"}/>
            <CreateForm onNewForm={handleNewForm}/>
            {forms.map((form) => {
                return (
                    <FormDetails onDeleteForm={handleDeleteForm} key={form.id} form={form} slots={slots}/>)
            })}
        </DashboardLayout>
    );
}