import type { IChat } from "@/types/chat"
import { Loader2 } from "lucide-react"

export default function Sidebar({
  chats,
  loading,
  onSelect,
}: {
  chats: IChat[]
  loading: boolean
  onSelect: (chat: IChat) => void
}) {
  return (
    <div className="flex flex-col gap-4 w-80 bg-white p-5 shadow-md border-r overflow-auto h-full">
      <h3 className="text-lg font-bold border-b pb-4 mb-2">Recent Conversations</h3>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        chats?.map((chat) => {
          // FIX: Access 'otherUser' instead of 'user' to match Backend & IChat type
          const { chatRoomId, otherUser, offeredSkill, requestedSkill } = chat

          return (
            <div
              className="cursor-pointer p-3 hover:bg-gray-50 rounded-lg border-b transition-colors"
              key={chat.chatRoomId}
              onClick={() => onSelect(chat)}
            >
              <div className="flex items-center gap-4 pb-2">
                {/* User Avatar Placeholder */}
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm text-blue-600 font-bold">
                  {chat.otherUser.fullName ? chat.otherUser.fullName.charAt(0).toUpperCase() : "?"}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{chat.otherUser.fullName || "Unknown User"}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Skill Exchange</span>
                </div>
              </div>

              {/* Skills Display */}
              <div className="flex justify-between items-center px-1 text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
                <div className="truncate max-w-[80px]" title={offeredSkill}>
                  {offeredSkill}
                </div>
                <span className="text-blue-400">↔</span>
                <div className="truncate max-w-[80px] text-right" title={requestedSkill}>
                  {requestedSkill}
                </div>
              </div>
            </div>
          )
        })
      )}

      {!loading && chats?.length === 0 && (
        <p className="text-center text-gray-400 mt-10 text-sm">No conversations yet.</p>
      )}
    </div>
  )
}
