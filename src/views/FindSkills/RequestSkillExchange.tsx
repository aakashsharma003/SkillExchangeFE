import { requestSkillExchange } from '@/api/exchange-request';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const [message, setMessage] = useState('Interested in a skill exchange?');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (requestedSkill === '')
      return toast.error('Please select a skill you want to learn');

    try {
      setLoading(true);
      let msg =
        message.trim() ??
        `Interested in a skill exchange? I would love to learn ${requestedSkill} from you!`;

      const payload: IexchangeRequestFormData = {
        receiverID: user.email,
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
      toast.error('something went wrong');
    }
  };

  useEffect(() => {
    if (message.startsWith('Interested in a skill exchange?'))
      setMessage(
        `Interested in a skill exchange? I would love to learn ${requestedSkill} from you!`,
      );
  }, [requestedSkill]);

  return (
    <Dialog open={user !== undefined} onOpenChange={open => !open && onClose()}>
      <DialogContent className='px-0 py-0'>
        <Card className='border-none shadow-none'>
          <CardContent className='py-0'>
            <h2 className='text-xl font-semibold mb-1'>Request SkillExchange</h2>
            <p>
              You're requesting{' '}
              <span className='font-medium text-lg italic'>{user.name}</span> to
              teach you...
            </p>
            {/* ...rest of the component... */}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
