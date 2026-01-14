import appRoutes from '@/routes/appRoutes';
import { User } from '@/types/user';
import { useNavigate } from 'react-router-dom';

export default function UserCard({
  user,
  onClick,
}: {
  user: User;
  onClick: () => void;
}) {
  const navigate = useNavigate();
  const { fullName, email, phone, skillsOffered } = user;

  return (
    <div className='bg-white p-5 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-full max-w-xs text-center flex flex-col'>
      <div
        className='w-[100px] h-[100px] bg-[#ddd] rounded-full mx-auto mb-[15px] flex items-center justify-center text-3xl text-[#555] font-bold cursor-pointer'
        onClick={() => navigate(appRoutes.userProfile, { state: email })}
      >
        {fullName.split(' ')[0]?.[0]?.toUpperCase()}
      </div>

      <h2 className='text-xl font-bold mb-1'>{fullName}</h2>
      <p className='mb-1 color-[#666] text-base'>📧 {email}</p>
      <p className='mb-2 color-[#666] text-base'>📞 {phone}</p>

      <div className='mb-4'>
        {skillsOffered.map((skill: string, i: number) => (
          <span
            key={i}
            className='bg-[#E0E7FF] text-[#1E40AF] px-2 py-1 rounded-2xl inline-block m-1 text-xs'
          >
            {skill}
          </span>
        ))}
      </div>

      <button
        className='mt-auto py-2 bg-[#3B82F6] text-white rounded-sm cursor-pointer hover:bg-blue-500 border-none'
        onClick={onClick}
      >
        Request exchange
      </button>
    </div>
  );
}
