import { useUser } from '@/context/auth/useUser';
import SideBar from '@/components/Dashboard/SideBar';
import SkillsOffered from '@/components/Dashboard/SkillsOffered';
import ProfileHeader from '@/components/Dashboard/ProfileHeader';
import SuggestedExchange from '@/components/Dashboard/SuggestedExchange';
import ProgressTracker from '@/components/Dashboard/ProgressTracker';
import UserReviews from '@/components/Dashboard/UserReviews';
import Badges from '@/components/Dashboard/Badges';
import SessionHistory from '@/components/Dashboard/SessionHistory';

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className='min-h-screen bg-gray-100 flex'>
      <SideBar />

      <main className='flex-1 p-8 space-y-8'>
        <ProfileHeader user={user} />

        <Badges />

        <SkillsOffered skills={user.skills} />

        <ProgressTracker />

        <UserReviews name={user.fullName} />

        <SessionHistory />

        <SuggestedExchange />
      </main>
    </div>
  );
};

export default Dashboard;
