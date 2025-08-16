import { searchUser } from '@/api/user';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { User } from '@/types/user';
import FindSkillInput from '@/components/FindSkills/FindSkillsInput';
import UserCard from '@/components/FindSkills/UserCard';
import { Loader2 } from 'lucide-react';
import RequestSkillExchange from './RequestSkillExchange';

const FindSkills = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedOnce, setSearcedOnce] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User>();

  const handleSearch = async (skill: string) => {
    setLoading(true);
    setUsers([]);
    setSearcedOnce(true);

    try {
      const res = await searchUser(skill);

      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <div className=' min-h-screen bg-[#f5f7fa] py-8'>
      <h1 className=' text-center text-5xl font-bold '>SkillExchange</h1>

      <div className=' max-w-3xl mx-auto mt-4'>
        <FindSkillInput onSelect={handleSearch} />
      </div>

      {loading ? (
        <Loader2 className='h-12 w-12 animate-spin mx-auto my-2' />
      ) : users.length === 0 ? (
        <p className='text-center text-[#666]'>
          {searchedOnce
            ? 'No users found with that skill.'
            : 'Search users with the skills of your interest'}
        </p>
      ) : (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 justify-items-center mx-auto'>
          {users.map((user, index) => (
            <UserCard
              key={index}
              user={user}
              onClick={() => setSelectedUser(user)}
            />
          ))}
        </div>
      )}

      {selectedUser && (
        <RequestSkillExchange
          user={selectedUser}
          onClose={() => setSelectedUser(undefined)}
        />
      )}
    </div>
  );
};

export default FindSkills;
