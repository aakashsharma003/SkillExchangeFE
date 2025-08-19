import { IChat } from '@/types/chat';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function Sidebar({
  chats,
  loading,
  onSelect,
}: {
  chats: IChat[];
  loading: boolean;
  onSelect: any;
}) {
  return (
    <aside className='flex w-80 flex-col border-r bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/70'>
      <div className='px-5 pt-5'>
        <h3 className='text-sm font-semibold tracking-wide text-gray-700'>Recent Conversations</h3>
      </div>
      <Separator className='my-4 opacity-60' />
      <ScrollArea className='h-full'>
        {loading ? (
          <div className='flex items-center justify-center py-6'>
            <Loader2 className='h-6 w-6 animate-spin text-gray-500' />
          </div>
        ) : (
          <div className='px-2'>
            {chats.map(({ chatRoomId, user, offeredSkill, requestedSkill }) => (
              <button
                className='group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-blue-50/70'
                key={chatRoomId}
                onClick={() =>
                  onSelect({ chatRoomId, user, offeredSkill, requestedSkill })
                }
              >
                <Avatar fallback={user.name.split(' ')[0]?.[0]} />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between'>
                    <span className='truncate text-sm font-semibold text-gray-900'>
                      {user.name}
                    </span>
                  </div>
                  <div className='mt-0.5 flex items-center gap-1 text-xs text-gray-600'>
                    <span className='truncate'>{offeredSkill}</span>
                    <span>↔</span>
                    <span className='truncate'>{requestedSkill}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
