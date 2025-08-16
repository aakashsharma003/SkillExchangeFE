import Logo from '../../assets/icons/logo.svg';
import SkillMatching from '../../assets/icons/Vector.svg';
import LiveChat from '../../assets/icons/Frame.svg';
import Certification from '../../assets/icons/Frame (1).svg';
import Community from '../../assets/icons/Frame (2).svg';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SkillCard from '@/components/LandingPage/SkillCard';
import appRoutes from '@/routes/appRoutes';

const LandingPage = () => {
  const navigate = useNavigate();

  function handleSignup() {
    navigate(appRoutes.signup);
  }

  useEffect(() => {
    localStorage.setItem('logged_in_once', 'true');
  }, []);

  return (
    <div className='h-screen bg-gradient-to-r from-blue-500 to-teal-400 flex flex-col'>
      <div className='px-4 pt-4'>
        <img src={Logo} alt='Skills exchange Logo' className='w-28' />
      </div>

      <section className='text-center'>
        <h1 className='text-5xl md:text-6xl font-extrabold text-white leading-tight'>
          Learn, Share and Grow Together
        </h1>

        <div className='mt-8 flex justify-center space-x-6'>
          <button
            className='border-2 border-white cursor-pointer text-white font-semibold px-12 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition'
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <button className='border-2 border-white cursor-pointer text-white font-semibold px-12 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition'>
            Find Skills
          </button>
        </div>
      </section>

      <section className='mt-8 mx-auto w-full max-w-7xl px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-white text-center mb-8'>
          Key Features
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <SkillCard
            icon={SkillMatching}
            title='Skill Matching'
            description='Connect with others who want to learn or share skills.'
          />
          <SkillCard
            icon={LiveChat}
            title='Live Chat & Video Calls'
            description='Communicate in real-time with your skill partners.'
          />
          <SkillCard
            icon={Certification}
            title='Verified Certifications'
            description='Ensure quality learning with verified certifications.'
          />
          <SkillCard
            icon={Community}
            title='Community Challenges'
            description='Participate in challenges to enhance your skills.'
          />
        </div>
      </section>

      <footer className='text-white text-sm text-center mt-auto mb-4'>
        © 2025 Skills exchange Community. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
