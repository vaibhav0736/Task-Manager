import React, {useState} from 'react'
import {HiOutlineMenu,HiOutlineX} from "react-icons/hi";
import SideMenu from './SideMenu'

const Navbar = () => {
    const [openSideMenu,setOpenSideMenu]=useState(false)
    const[activeMenu,setActiveMenu]=useState('dashboard');
 
 
    return (
    <div className='flex gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 items-center'>
      <button 
        className='block lg:hidden text-black'
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? ( 
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>

      {openSideMenu && ( 
        <div className='fixed top-[61px] left-0 w-full bg-white z-50'>
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;