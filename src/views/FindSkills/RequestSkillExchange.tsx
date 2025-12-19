import { requestSkillExchange } from '@/api/exchange-request';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IexchangeRequestFormData } from '@/types/swal-request';
import { User } from '@/types/user';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function RequestSkillExchange({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const [requestedSkill, setRequestedSkill] = useState('');
  const [message, setMessage] = useState('Interested in a skill swap?');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (requestedSkill === '')
      return toast.error('Please select a skill you want to learn');

    try {
      setLoading(true);
      
      // Fallback message if trimmed input is empty
      let msg = message.trim() || `Interested in a skill exchange? I would love to learn ${requestedSkill} from you!`;

      const payload: IexchangeRequestFormData = {
        receiverId: user.email, 
        message: msg,
        requestedSkill,
      };

      const res = await requestSkillExchange(payload);

      if (!res.success) {
        setLoading(false);
        return toast.error(res.message);
      }

      setLoading(false);
      toast.success('Request sent successfully');
      onClose();
    } catch (err) {
      setLoading(false);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    // Automatically update the message template when a skill is selected
    if (message.startsWith('Interested in a skill swap?')) {
      setMessage(
        `Interested in a skill swap? I would love to learn ${requestedSkill} from you!`,
      );
    }
  }, [requestedSkill]);

  return (
    <Dialog open={user !== undefined} onOpenChange={open => !open && onClose()}>

      <DialogContent className='sm:max-w-[425px] p-6'>       
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Request Skill Swap</DialogTitle>
          <DialogDescription>
            You're requesting <span className='font-medium text-foreground italic'>{user.fullName}</span> to teach you...
          </DialogDescription>
        </DialogHeader>

        <Card className='border-none shadow-none mt-4'>
          <CardContent className='p-0'>
            <div className='space-y-4'>
              {/* Skill Selection Section */}
              <div className='space-y-2'>
                <Label htmlFor='skill'>Skill</Label>
                <Select onValueChange={setRequestedSkill}>
                  <SelectTrigger className='w-full cursor-pointer'>
                    <SelectValue placeholder='Select a skill you want to learn' />
                  </SelectTrigger>
                  <SelectContent className='max-h-64'>
                    {user?.skills?.map(s => (
                      <SelectItem key={s} value={s} className='cursor-pointer'>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message Input Section */}
              <div className='space-y-2'>
                <Label htmlFor='message'>Message (optional)</Label>
                <Textarea
                  id='message'
                  placeholder='Write a personalized note...'
                  className='min-h-[100px]'
                  value={message}
                  onChange={({ target }) => setMessage(target.value)}
                />
              </div>

              {/* Action Button */}
              <Button 
                className='w-full cursor-pointer mt-4' 
                onClick={onSubmit} 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Send Request'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}