import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthProvider.jsx";
import {ToastProvider} from "./contexts/ToastProvider.jsx";
import {ConfirmProvider} from "./contexts/ConfirmProvider.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ToastProvider>
            <ConfirmProvider>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </ConfirmProvider>
        </ToastProvider>
    </BrowserRouter>
)
