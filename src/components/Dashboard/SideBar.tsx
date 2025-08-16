import Challenge from '@/assets/icons/Challenge';
import appRoutes from '@/routes/appRoutes';
import LogoutModal from '@/views/Dashboard/LogoutModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SideBar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <aside className='w-64 bg-white p-6 shadow-md'>
        <h1 className='text-2xl font-bold mb-8'>Dashboard</h1>
        <nav className='space-y-6'>
          <div
            className='flex items-center space-x-3 text-gray-700 hover:text-blue-500 cursor-pointer'
            onClick={() => navigate(appRoutes.dashboard)}
          >
            <i className='fas fa-home'></i>
            <span>Home</span>
          </div>
          <div
            className='flex items-center space-x-3 text-gray-700 hover:text-blue-500 cursor-pointer'
            onClick={() => navigate(appRoutes.skillExchangeRequests)}
          >
            <i className='fas fa-user'></i>
            <span>My Requests</span>
          </div>
          <div
            className='flex items-center space-x-3 text-gray-700 hover:text-blue-500 cursor-pointer'
            onClick={() => navigate(appRoutes.findSkills)}
          >
            <i className='fas fa-search'></i>
            <span>Find Skills</span>
          </div>
          <div
            className='flex items-center space-x-3 text-gray-700 hover:text-blue-500 cursor-pointer'
            onClick={() => navigate(appRoutes.chats)}
          >
            <i className='fas fa-comments'></i>
            <span>Chats</span>
          </div>
          <div
            className='flex items-center space-x-3 text-gray-700 hover:text-blue-500 cursor-pointer'
            onClick={() => navigate(appRoutes.certifications)}
          >
            <i className='fa-solid fa-certificate'></i>
            <span>Certifications</span>
          </div>
          <div
            className='flex items-center space-x-3 text-gray-700 hover:text-blue-500 cursor-pointer group'
            onClick={() => navigate(appRoutes.skillChallenges)}
          >
            <Challenge />
            <span>Challenges</span>
          </div>
          <div
            className='flex items-center space-x-3 text-gray-700 hover:text-blue-500 cursor-pointer'
            onClick={() => navigate(appRoutes.editProfile)}
          >
            <i className='fas fa-cog'></i>
            <span>Settings</span>
          </div>
          <div
            className='flex items-center space-x-3 text-gray-700 hover:text-red-500 cursor-pointer'
            onClick={() => setShowLogoutModal(true)}
          >
            <i className='fa-solid fa-right-from-bracket'></i>
            <span>Log Out</span>
          </div>
        </nav>
      </aside>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}
