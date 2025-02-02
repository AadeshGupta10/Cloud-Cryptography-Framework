import { Navigate, Outlet } from 'react-router-dom'
import useValidate from '../../hooks/useValidate'
import { useSelector } from 'react-redux'
import Verification_header from '../../components/Verification Header/Verification_header';

const Basic_protection = () => {
    useValidate()

    const user = useSelector((state: any) => state.authentication);
    const isLoading = useSelector((state: any) => state.isLoading)

    const token = localStorage.getItem("token");

    return (

        (!!token && isLoading) ?
            <div className='h-screen flex flex-col justify-center items-center gap-3 text-center text-lg font-semibold'>
                <div className=''><Verification_header /></div>
                <p className='m-0'>Your Dashboard is Getting Ready, <br /> Hold for a while...</p>
            </div> //While Server is Getting Notes
            :
            user ? <Navigate to={"/dashboard"} /> : <Outlet />

                    // Dashboard                  Login/Signup
    )
}

export default Basic_protection