import { Close, Menu } from '@mui/icons-material';
import { useState } from 'react'
import { useSelector } from 'react-redux';

const Header = () => {

    const [menu, setMenu] = useState(false)

    const username = useSelector((state: any) => state.username)

    const handleMenu = () => {
        setMenu(prev => !prev)
    }

    const [profile, toggleProfile] = useState(false)

    const handleProfile = () => {
        toggleProfile(prev => !prev)
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return (
        <>
            <div className={`bg-white py-2 px-3 flex flex-wrap justify-between ${!menu ? "items-center" : ""} md:items-center shadow-md dark:shadow-gray-700 gap-3 sticky top-0`}>
                <img src="/logo.png"
                    alt="notely"
                    className='w-14 object-contain object-center' />

                <div className='dark:text-white flex justify-center items-center gap-4 md:hidden'>
                    {
                        menu ? <Close onClick={handleMenu} /> : <Menu onClick={handleMenu} />
                    }
                </div>

                <div className={`${menu ? "w-full md:w-fit flex justify-center" : "hidden"} md:flex`}>
                    <div className={`border-2 border-gray-300 dark:border-gray-600 bg-white-custom dark:bg-dark text-[#424851] dark:text-white px-2 py-1 flex flex-col justify-between items-center gap-x-3 rounded-md relative user-select-none transition-all`}>
                        <div className='flex justify-between items-center gap-3 cursor-pointer ps-2' onClick={handleProfile} >
                            <span className='fw-semibold max-w-[30rem] line-clamp-1'>
                                {
                                    username ? username:"Anonymous User"
                                }
                            </span>
                            <img src="down_arrow.webp" alt="" className='w-3' />
                        </div>
                        {
                            profile &&
                            <div className='w-full md:border-2 md:border-gray-300 dark:border-gray-600 dark:bg-dark md:bg-white-custom md:absolute md:top-8 p-2 rounded-bl-md rounded-b-md flex flex-col justify-center items-center gap-3'>
                                <button className='w-full btn btn-danger' onClick={() => handleLogout()}>
                                    Logout
                                </button>
                            </div>
                        }
                    </div>
                </div>

            </div>
        </>
    )
}

export default Header