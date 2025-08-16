import { Badge } from './ui/badge';
import { Button } from './ui/button';
import ReqCardSkillInput from './ReqCardSkillInput';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IexchangeRequest } from '@/types/swal-request';
import { acceptRequest, rejectRequest } from '@/api/exchange-request';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import appRoutes from '@/routes/appRoutes';
import { createChatRoom } from '@/api/chat';

export default function ReceivedReqCard({
  req,
  onAction,
}: {
  req: IexchangeRequest;
  onAction: any;
}) {
  const navigate = useNavigate();
  const {
    receiverDetails: receiver,
    senderDetails: sender,
    request: { id, message, status, offeredSkill, requestedSkill },
  } = req;
  const [selectedSkill, setSeletedSkill] = useState('');
  const [loading, setLoading] = useState(0);

  const bgClass = status === 'Accepted' ? 'bg-green-400' : 'bg-red-400';

  const handleAccept = async () => {
    if (selectedSkill === '')
      return toast.error(
        'Please select a skill that you want to learn in return.',
      );
    try {
      setLoading(1);

      const res = await acceptRequest(id, selectedSkill);

      if (!res.success) return toast.error(res.message);

      const response = await createChatRoom({
        user1Id: sender.id,
        user2Id: receiver.id,
        exchangeRequestId: res.data.id,
      });

      if (!response.success) return toast.error(response.message);

      setLoading(0);
      onAction(res.data);
    } catch (err) {
      console.error(err);
      setLoading(0);
      toast.error('Something went wrong. unable to accept the request.');
    }
  };

  const handleReject = async () => {
    try {
      setLoading(2);

      const res = await rejectRequest(id);

      if (!res.success) return toast.error(res.message);

      setLoading(0);
      onAction(res.data);
    } catch (err) {
      console.error(err);
      setLoading(0);
      toast.error('Something went wrong. unable to reject the request.');
    }
  };

  return (
    <div className='bg-white p-5 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-full text-center flex flex-col'>
      <div className='flex text-left gap-4 items-center'>
        <div
          className='w-12 h-12 bg-[#ddd] rounded-full flex items-center justify-center text-3xl text-[#555] font-bold cursor-pointer'
          onClick={() => {
            navigate(appRoutes.userProfile, { state: sender.email });
          }}
        >
          {sender.name.split(' ')[0]?.[0]?.toUpperCase()}
        </div>

        <div>
          <h2 className='font-bold'>{sender.name}</h2>
          <p className='mb-1 color-[#666] text-xs'>📧 {sender.email}</p>
          <p className='mb-2 color-[#666] text-xs'>📞 {sender.contact}</p>
        </div>
      </div>

      <div className='text-left text-sm mt-2'>
        <span className=' font-semibold text-base'>
          Skill he want to learn:{' '}
        </span>
        {requestedSkill}
      </div>

      {status === 'Pending' && (
        <div className='text-left text-sm flex gap-4 items-start mt-2'>
          <span className=' font-semibold text-base'>
            Skill you can learn from him:{' '}
          </span>

          <div className='flex-1'>
            <ReqCardSkillInput
              onSelect={(skill: any) => setSeletedSkill(skill)}
              allSkills={sender.skills}
            />
          </div>
        </div>
      )}

      {status == 'Accepted' && (
        <div className='text-left text-sm'>
          <span className=' font-semibold text-base'>
            Skill you want to learn:{' '}
          </span>
          {offeredSkill}
        </div>
      )}

      {message !== '' && (
        <div className='text-left text-sm my-2'>
          <span className=' font-semibold text-base'>
            Note from their side: <br />
          </span>
          {message}
        </div>
      )}

      {status !== 'Pending' ? (
        <Badge
          className={`mt-2 w-full py-2 font-semibold ${bgClass} text-black`}
        >
          {status}
        </Badge>
      ) : (
        <div className='flex gap-3 pt-2'>
          <Button
            onClick={handleAccept}
            size='sm'
            className='cursor-pointer'
            disabled={loading !== 0}
          >
            {loading === 1 ? (
              <Loader2 className='h-6 w-6 animate-spin mx-auto my-2' />
            ) : (
              'Accept'
            )}
          </Button>
          <Button
            onClick={handleReject}
            variant='outline'
            size='sm'
            className='cursor-pointer'
            disabled={loading !== 0}
          >
            {loading === 2 ? (
              <Loader2 className='h-6 w-6 animate-spin mx-auto my-2' />
            ) : (
              'Reject'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
