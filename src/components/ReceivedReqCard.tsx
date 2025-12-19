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
  onAction: (updatedReq: IexchangeRequest) => void;
}) {
  const navigate = useNavigate();

  // FIX: Destructure directly from req as the JSON is flat now
  const {
    id,
    message,
    status,
    offeredSkill,
    requestedSkill,
    sender,
    receiver
  } = req;

  const [selectedSkill, setSeletedSkill] = useState('');
  const [loading, setLoading] = useState(0);

  // FIX: Updated to match uppercase status from JSON
  const bgClass = status === 'ACCEPTED' ? 'bg-green-400' : 'bg-red-400';

  const handleAccept = async () => {
    if (selectedSkill === '')
      return toast.error('Please select a skill that you want to learn in return.');
    
    try {
      setLoading(1);
      const res = await acceptRequest(id, selectedSkill);

      if (!res.success) {
        setLoading(0);
        return toast.error(res.message);
      }

      // Create Chat Room after successful acceptance
      const response = await createChatRoom({
        user1Id: sender.id,
        user2Id: receiver.id,
        exchangeRequestId: res.data.id,
      });

      if (!response.success) {
        setLoading(0);
        return toast.error("Accepted, but failed to create chat room.");
      }

      setLoading(0);
      onAction(res.data); // Update UI with new state
      toast.success("Request Accepted!");
    } catch (err) {
      console.error(err);
      setLoading(0);
      toast.error('Something went wrong.');
    }
  };

  const handleReject = async () => {
    try {
      setLoading(2);
      const res = await rejectRequest(id);

      if (!res.success) {
        setLoading(0);
        return toast.error(res.message);
      }

      setLoading(0);
      onAction(res.data);
      toast.success("Request Rejected.");
    } catch (err) {
      console.error(err);
      setLoading(0);
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className='bg-white p-5 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-full text-center flex flex-col mb-4'>
      <div className='flex text-left gap-4 items-center'>
        <div
          className='w-12 h-12 bg-[#ddd] rounded-full flex items-center justify-center text-xl text-[#555] font-bold cursor-pointer'
          onClick={() => navigate(appRoutes.userProfile, { state: sender.email })}
        >
          {sender.fullName?.[0]?.toUpperCase()}
        </div>

        <div>
          <h2 className='font-bold text-lg'>{sender.fullName}</h2>
          <p className='text-[#666] text-xs'>📧 {sender.email}</p>
          <p className='text-[#666] text-xs'>📞 {sender.phone}</p>
        </div>
      </div>

      <div className='text-left text-sm mt-4'>
        <span className='font-semibold text-gray-700'>Skill he wants to learn: </span>
        <Badge variant="secondary">{requestedSkill}</Badge>
      </div>

      {/* Logic for PENDING status */}
      {status === 'PENDING' && (
        <div className='text-left text-sm flex flex-col gap-2 mt-3'>
          <span className='font-semibold text-gray-700'>
            Skill you can learn from him:
          </span>
          <div className='w-full'>
            <ReqCardSkillInput
              onSelect={(skill: any) => setSeletedSkill(skill)}
              allSkills={sender.skills}
            />
          </div>
        </div>
      )}

      {/* Logic for ACCEPTED status */}
      {status === 'ACCEPTED' && (
        <div className='text-left text-sm mt-2'>
          <span className='font-semibold text-gray-700'>Skill you chose to learn: </span>
          <Badge className="bg-green-100 text-green-800 border-green-200">{offeredSkill}</Badge>
        </div>
      )}

      {message && (
        <div className='text-left text-sm bg-gray-50 p-3 rounded-md my-3 border-l-4 border-blue-400'>
          <span className='font-semibold'>Note:</span>
          <p className="italic text-gray-600">"{message}"</p>
        </div>
      )}

      {status !== 'PENDING' ? (
        <Badge
          className={`mt-2 w-full py-2 justify-center font-bold ${bgClass} text-white border-none`}
        >
          {status}
        </Badge>
      ) : (
        <div className='flex gap-3 pt-4'>
          <Button
            onClick={handleAccept}
            className='flex-1 cursor-pointer bg-black hover:bg-gray-800'
            disabled={loading !== 0}
          >
            {loading === 1 ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Accept'}
          </Button>
          <Button
            onClick={handleReject}
            variant='outline'
            className='flex-1 cursor-pointer border-red-200 text-red-600 hover:bg-red-50'
            disabled={loading !== 0}
          >
            {loading === 2 ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Reject'}
          </Button>
        </div>
      )}
    </div>
  );
}