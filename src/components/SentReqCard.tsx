import { IexchangeRequest } from '@/types/swal-request';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import appRoutes from '@/routes/appRoutes';

export default function SentReqCard({ req }: { req: IexchangeRequest }) {
  const navigate = useNavigate();
  const {
    receiverDetails: receiver,
    request: { message, status, requestedSkill, offeredSkill },
  } = req;

  const bgClass =
    status === 'Pending'
      ? 'bg-yellow-400'
      : status === 'Accepted'
        ? 'bg-green-400'
        : 'bg-red-400';

  return (
    <div className='bg-white p-5 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-full text-center flex flex-col'>
      <div className='flex text-left gap-4 items-center'>
        <div
          className='w-12 h-12 bg-[#ddd] rounded-full flex items-center justify-center text-3xl text-[#555] font-bold cursor-pointer'
          onClick={() =>
            navigate(appRoutes.userProfile, { state: receiver.email })
          }
        >
          {receiver.name.split(' ')[0]?.[0]?.toUpperCase()}
        </div>

        <div>
          <h2 className='font-bold'>{receiver.name}</h2>
          <p className='mb-1 color-[#666] text-xs'>📧 {receiver.email}</p>
          <p className='mb-2 color-[#666] text-xs'>📞 {receiver.contact}</p>
        </div>
      </div>

      <div className='text-left text-sm'>
        <span className=' font-semibold text-base'>
          Skill you want to learn:{' '}
        </span>
        {requestedSkill}
      </div>

      {status === 'Accepted' && (
        <div className='text-left text-sm'>
          <span className=' font-semibold text-base'>
            Skill he want to learn:{' '}
          </span>
          {offeredSkill}
        </div>
      )}

      {message !== '' && (
        <div className='text-left text-sm mt-2'>
          <span className=' font-semibold text-base'>
            Note from your side: <br />
          </span>
          {message}
        </div>
      )}

      <Badge
        className={`mt-4 w-full py-2 font-semibold ${bgClass}`}
        variant='secondary'
      >
        {status}
      </Badge>
    </div>
  );
}
