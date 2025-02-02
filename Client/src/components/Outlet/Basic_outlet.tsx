import { Outlet } from 'react-router-dom'

const Basic_outlet = () => {

  return (
    <div className='h-screen overflow-y-auto custom-scrollbar bg-white-custom dark:bg-dark'>
      <Outlet />
    </div>
  )
}

export default Basic_outlet