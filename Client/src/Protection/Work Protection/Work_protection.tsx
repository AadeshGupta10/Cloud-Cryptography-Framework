import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Work_protection = () => {

    const user = useSelector((state: any) => state.authentication);

    return (
        user ? <Outlet /> : <Navigate to={"/"} />

            // Dashboard     Login/Signup
    )
}

export default Work_protection