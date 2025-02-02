import { Outlet } from 'react-router-dom'
import Header from '../Header.tsx/Header'

const Dashboard_outlet = () => {
    return (
        <div className='min-h-screen'>
            <Header />
            <Outlet />
        </div>
    )
}

export default Dashboard_outlet