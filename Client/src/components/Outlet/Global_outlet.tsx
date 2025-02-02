import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Global_outlet = () => {
    return (
        <div>
            <ToastContainer newestOnTop={true} pauseOnHover={false} pauseOnFocusLoss={false}/>
            <Outlet />
        </div>
    )
}

export default Global_outlet