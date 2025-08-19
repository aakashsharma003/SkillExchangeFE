import Logo from '../../assets/icons/logo.svg';
import SkillMatching from '../../assets/icons/Vector.svg';
import LiveChat from '../../assets/icons/Frame.svg';
import Certification from '../../assets/icons/Frame (1).svg';
import Community from '../../assets/icons/Frame (2).svg';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import appRoutes from '@/routes/appRoutes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage = () => {
  const navigate = useNavigate();

  function handleSignup() {
    navigate(appRoutes.signup);
  }

  useEffect(() => {
    localStorage.setItem('logged_in_once', 'true');
  }, []);

  return (
    <div className='min-h-screen flex flex-col bg-[radial-gradient(50%_50%_at_50%_0%,rgba(59,130,246,0.25)_0%,rgba(20,184,166,0.15)_50%,transparent_90%)]'>
      <header className='px-6 pt-6 flex items-center justify-between'>
        <img src={Logo} alt='Skills exchange Logo' className='w-28 select-none' />
        <div className='hidden md:flex gap-4'>
          <Button variant='ghost' className='text-white/90 hover:text-white'>Features</Button>
          <Button variant='ghost' className='text-white/90 hover:text-white'>Community</Button>
          <Button variant='ghost' className='text-white/90 hover:text-white'>Pricing</Button>
        </div>
        <div className='flex gap-3'>
          <Button variant='secondary' className='backdrop-blur-md' onClick={() => navigate(appRoutes.login)}>
            Log in
          </Button>
          <Button onClick={handleSignup} className='bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-[0_8px_30px_rgba(59,130,246,0.35)] hover:scale-[1.02] transition-transform'>
            Get started
          </Button>
        </div>
      </header>

      <section className='relative mx-auto mt-10 flex w-full max-w-7xl flex-1 flex-col items-center px-6 text-center'>
        <div className='pointer-events-none absolute inset-0 -z-10 animate-pulse-slow [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]'>
          <div className='absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl'></div>
          <div className='absolute left-1/3 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/30 blur-3xl'></div>
        </div>

        <h1 className='mt-8 bg-gradient-to-b from-white to-white/70 bg-clip-text text-5xl font-extrabold leading-tight text-transparent md:text-7xl'>
          Learn, Share, and Grow Together
        </h1>
        <p className='mt-6 max-w-2xl text-balance text-white/80'>
          The SkillExchange platform that matches learners with mentors, powers real‑time chat and video, and validates progress with certifications.
        </p>
        <div className='mt-8 flex flex-col items-center gap-4 sm:flex-row'>
          <Button size='lg' onClick={handleSignup} className='bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-[0_12px_40px_rgba(20,184,166,0.35)] hover:scale-[1.03] transition-transform'>
            Create your account
          </Button>
          <Button size='lg' variant='outline' className='backdrop-blur supports-[backdrop-filter]:bg-white/20 text-white border-white/40 hover:bg-white/20'>
            Explore skills
          </Button>
        </div>

        {/* 3D tilted preview card */}
        <div className='mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3'>
          {[
            { icon: SkillMatching, title: 'Skill Matching', desc: 'Connect with people who want to learn or teach the same skill.' },
            { icon: LiveChat, title: 'Live Chat & Calls', desc: 'Real‑time messaging and calls powered by Spring Boot & WebSockets.' },
            { icon: Certification, title: 'Verified Progress', desc: 'Track milestones and earn verifiable certifications.' },
          ].map((item, idx) => (
            <Card
              key={item.title}
              className='group relative border-white/20 bg-white/5 text-white backdrop-blur-xl transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.45)] [transform:perspective(1000px)_rotateX(2deg)] hover:[transform:perspective(1000px)_rotateX(0.5deg)]'
            >
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <img src={item.icon} className='h-8 w-8 drop-shadow' alt='' />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='text-white/80'>{item.desc}</CardContent>
              {idx === 1 && (
                <div className='pointer-events-none absolute -inset-px -z-10 rounded-[inherit] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.35)_0deg,rgba(20,184,166,0.35)_180deg,transparent_360deg)] opacity-0 blur-xl transition-opacity group-hover:opacity-100' />
              )}
            </Card>
          ))}
        </div>
      </section>

      <footer className='mt-16 mb-6 text-center text-xs text-white/70'>
        © 2025 SkillExchange Community. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
