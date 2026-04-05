import { useEffect, useState } from "react"

import { searchUser } from "@/api/user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, GraduationCap, Loader2, MapPin, Search, Star, Bookmark, Flag, Clock, Repeat, Users } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { User } from "@/types/user"
import RequestSkillExchange from "./RequestSkillExchange"

const FindSkills = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | undefined>()

  const handleSearch = async (skill: string) => {
    setLoading(true)
    try {
      const res = await searchUser(skill)
      setUsers(res.data)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch("")
  }, [])

  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-full">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">SkillExchange</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Discover people with the skills you want to learn.
          </p>
        </div>

        {/* Search bar constrained to max-w-2xl so it doesn't stretch too much */}
        <div className="relative mb-12 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for skills (e.g. React, Salesforce)..."
            className="h-14 pl-12 pr-24 text-base sm:text-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
          />
          <Button className="absolute right-2 top-2 h-10 px-4 sm:px-6" onClick={() => handleSearch(searchQuery)}>
            Search
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {users.map((user) => (
              <Card
                key={user.id}
                className="flex min-w-0 flex-col rounded-[32px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white p-2.5 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)]"
              >
                {/* Top Section with Image and overlapping avatars */}
                <div className="relative h-44 rounded-[26px] overflow-hidden w-full bg-gradient-to-br from-[#f14400] via-[#f7b03b] to-[#fecf54]">
                  {/* Abstract Gradient Background */}
                  <img
                    src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?auto=format&fit=crop&w=600&h=300"
                    className="w-full h-full object-cover opacity-90 mix-blend-overlay"
                    alt="cover"
                  />
                </div>

                <div className="relative px-3">
                  {/* Overlapping Avatar */}
                  <div className="absolute -top-[4.5rem] left-1.5 rounded-[40px] border-[5px] border-white p-0 shadow-sm bg-white overflow-hidden h-[92px] w-[92px] flex items-center justify-center">
                    {user.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} alt={user.fullName} className="w-full h-full object-cover bg-amber-50" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {/* Overlapping Badge */}
                  <div className="absolute -top-[1.6rem] right-1.5 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-[0_2px_10px_rgb(0,0,0,0.05)] border border-black/5">
                    <div className="bg-[#e41e26] rounded-md h-[22px] w-[22px] flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M15.1 2H22v20L15.1 2zM9 2H2v20l7-20zm3.1 11.3l2.8 6.7h-5.6l2.8-6.7z" /></svg>
                    </div>
                    <span className="font-bold text-[14px] text-black tracking-tight">Adobe Co.</span>
                  </div>
                </div>

                <div className="mt-[56px] px-3.5 flex justify-between items-start">
                  <div>
                    <h3 className="text-[22px] font-bold tracking-tight text-black leading-none">{user.fullName}</h3>
                    <p className="text-muted-foreground/60 font-semibold tracking-wide text-[14px] mt-2">{user.bio || "Member"}</p>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full h-11 w-11 border-muted-foreground/20 shadow-sm flex items-center justify-center hover:bg-muted/10 shrink-0">
                    <Bookmark className="h-[18px] w-[18px] text-muted-foreground/80 fill-muted-foreground/80" />
                  </Button>
                </div>

                <div className="mt-5 px-3.5 flex flex-col gap-3">
                  {/* Offering */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-2 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" /> Can Teach
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skills?.length ? user.skills.map((s, i) => (
                        <Badge key={i} className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-0.5 text-[11px] font-medium border-none shadow-[0_2px_8px_rgba(37,99,235,0.2)]">
                          {s}
                        </Badge>
                      )) : (
                        <span className="text-[11px] text-muted-foreground font-medium px-1">None specified</span>
                      )}
                    </div>
                  </div>
                  {/* Seeking */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-2 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" /> Wants to Learn
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.interests?.length ? user.interests.map((s, i) => (
                        <Badge key={i} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium border-none">
                          {s}
                        </Badge>
                      )) : (
                        <span className="text-[11px] text-muted-foreground font-medium px-1">None specified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 mx-1.5 border border-black-[0.03] rounded-[24px] py-4 px-5 flex justify-between items-center bg-[#ffffff] shadow-[0_2px_10px_rgb(0,0,0,0.03)] ring-1 ring-black/5">
                  {/* Stats block 1 */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-[20px] w-[20px] fill-[#fde047] text-[#fde047]" strokeWidth={1} />
                      <span className="font-bold text-[17px] leading-none">5.0</span>
                    </div>
                    <span className="text-[12px] font-semibold text-muted-foreground/80 mt-1">Rating</span>
                  </div>
                  {/* Stats block 2 */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Repeat className="h-[18px] w-[18px] text-[#2563eb]" strokeWidth={2.5} />
                      <span className="font-bold text-[17px] leading-none">12</span>
                    </div>
                    <span className="text-[12px] font-semibold text-muted-foreground/80 mt-1">Exchanged</span>
                  </div>
                  {/* Stats block 3 */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-[22px] w-[22px] rounded-full bg-[#bd48e5] flex items-center justify-center">
                        <Users className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                      </div>
                      <span className="font-bold text-[17px] leading-none">18</span>
                    </div>
                    <span className="text-[12px] font-semibold text-muted-foreground/80 mt-1">Connections</span>
                  </div>
                </div>

                <div className="mt-5 mb-1 px-1.5">
                  <Button className="w-full h-[54px] rounded-full bg-gradient-to-b from-[#333] to-[#111] text-white font-[600] text-[16px] hover:opacity-90 shadow-md transition-opacity border-none" onClick={() => setSelectedUser(user)}>
                    Request Exchange
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <RequestSkillExchange user={selectedUser} onClose={() => setSelectedUser(undefined)} />
      )}
    </div>
  )
};

export default FindSkills;