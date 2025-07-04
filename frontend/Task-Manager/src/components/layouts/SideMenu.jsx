import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [SideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
    return () => {};
  }, [user]);

  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200 sticky top-[61px] z-20'>
      <div className='flex flex-col items-center justify-center mb-7 pt-5'>
        <div className='relative'>
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt='Profile'
              className='w-20 h-20 bg-slate-400 rounded-full object-cover'
            />
          ) : (
            <div className='w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-xl'>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {user?.role === "admin" && (
          <div className='text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1'>
            Admin
          </div>
        )}

        <h5 className='text-[12px] font-medium leading-6 mt-3'>{user?.name || "Unknown"}</h5>
        <p className='text-[12px] text-gray-500'>{user?.email || "No email"}</p>
      </div>

      {SideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-blue-500"
              : "text-gray-700"
          } py-3 px-6 mb-3 cursor-pointer hover:bg-gray-50 transition`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
