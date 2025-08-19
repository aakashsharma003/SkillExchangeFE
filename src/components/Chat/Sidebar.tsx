import { IChat } from '@/types/chat';
import { Loader2, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';

export default function Sidebar({
  chats,
  loading,
  onSelect,
}: {
  chats: IChat[];
  loading: boolean;
  onSelect: any;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(({ user, offeredSkill, requestedSkill }) =>
      [user.name, offeredSkill, requestedSkill].some(v => v.toLowerCase().includes(q)),
    );
  }, [chats, query]);

  return (
    <aside className='flex w-80 flex-col border-r bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/80'>
      <div className='px-4 pt-4'>
        <h3 className='text-sm font-semibold tracking-tight'>Conversations</h3>
        <div className='mt-3 flex items-center gap-2 rounded-md border bg-background px-2'>
          <Search className='h-4 w-4 text-muted-foreground' />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Search people or skills'
            className='h-8 border-none shadow-none focus-visible:ring-0'
          />
        </div>
      </div>
      <Separator className='my-3 opacity-60' />
      <ScrollArea className='h-full'>
        {loading ? (
          <div className='flex items-center justify-center py-6'>
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <div className='px-2'>
            {filtered.map(({ chatRoomId, user, offeredSkill, requestedSkill }) => (
              <button
                className='group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-muted'
                key={chatRoomId}
                onClick={() =>
                  onSelect({ chatRoomId, user, offeredSkill, requestedSkill })
                }
              >
                <Avatar fallback={user.name.split(' ')[0]?.[0]} />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between'>
                    <span className='truncate text-sm font-semibold'>{user.name}</span>
                  </div>
                  <div className='mt-0.5 flex items-center gap-1 text-xs text-muted-foreground'>
                    <span className='truncate'>{offeredSkill}</span>
                    <span>↔</span>
                    <span className='truncate'>{requestedSkill}</span>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className='px-3 py-8 text-center text-xs text-muted-foreground'>No conversations</div>
            )}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
