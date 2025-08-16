import { IChat } from '@/types/chat';
import { Loader2 } from 'lucide-react';

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
    <div className='flex flex-col gap-4 w-3xs bg-white p-5 shadow-md border-1 overflow-auto'>
      <h3 style={{ marginBottom: '20px' }}>Recent Conversations</h3>
      {loading ? (
        <Loader2 className='h-6 w-6 animate-spin mx-auto my-2' />
      ) : (
        chats.map(({ chatRoomId, user, offeredSkill, requestedSkill }) => (
          <div
            className='cursor-pointer pb-4 border-b'
            key={chatRoomId}
            onClick={() =>
              onSelect({ chatRoomId, user, offeredSkill, requestedSkill })
            }
          >
            <div className='flex items-center cursor-pointer gap-4 pb-4'>
              <div className='w-8 h-8 bg-[#ddd] rounded-full flex items-center justify-center text-sm text-[#555] font-semibold'>
                {user.name.split(' ')[0]?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {user.name}
              </span>
            </div>

            <div className='flex  justify-between px-1 gap-1'>
              <div className='truncate whitespace-nowrap overflow-hidden text-ellipsis flex-1'>
                {offeredSkill}
              </div>{' '}
              ↔{' '}
              <div className='truncate whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-right'>
                {requestedSkill}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
