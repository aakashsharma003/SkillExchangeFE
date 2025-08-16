import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/auth/useAuth';

export default function LogoutModal({ open, onClose }: any) {
  const { logout } = useAuth();

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button className='cursor-pointer' onClick={onClose}>
            No
          </Button>
          <Button
            className='cursor-pointer bg-red-700 hover:bg-red-800'
            onClick={logout}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
