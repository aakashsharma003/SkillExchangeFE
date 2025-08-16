import { useUser } from '@/context/auth/useUser';
import SideBar from '@/components/Dashboard/SideBar';
import SkillsOffered from '@/components/Dashboard/SkillsOffered';
import ProfileHeader from '@/components/Dashboard/ProfileHeader';
import SuggestedExchange from '@/components/Dashboard/SuggestedExchange';
import ProgressTracker from '@/components/Dashboard/ProgressTracker';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import appRoutes from '@/routes/appRoutes';
import toast from 'react-hot-toast';
import { fetchUserProfile } from '@/api/user';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/user';
import Badges from '@/components/Dashboard/Badges';
import SessionHistory from '@/components/Dashboard/SessionHistory';
import UserReviews from '@/components/Dashboard/UserReviews';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (!email) {
      navigate(appRoutes.dashboard);
      return;
    }

    (async () => {
      try {
        setLoading(true);

        const res = await fetchUserProfile(email);

        if (!res.success) {
          return toast.error(res.message);
        }
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
        toast.error('something went wrong');
      }
    })();
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 flex'>
      <SideBar />

      {loading || !user ? (
        <main className='flex-1 flex justify-center items-center'>
          <Loader2 className='h-24 w-24 animate-spin mx-auto my-2' />
        </main>
      ) : (
        <main className='flex-1 p-8 space-y-8'>
          <ProfileHeader user={user} />

          <Badges />

          <SkillsOffered skills={user.skills} />

          <ProgressTracker />

          <UserReviews />

          <SessionHistory />
        </main>
      )}
    </div>
  );
};

export default Profile;
