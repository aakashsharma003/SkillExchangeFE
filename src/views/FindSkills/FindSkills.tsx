import { useEffect, useState } from "react"

import { searchUser } from "@/api/user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, GraduationCap, Loader2, MapPin, Search, Star } from "lucide-react"
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
    <div className="w-full bg-background px-4 py-4 md:px-10 md:py-8">
      <div className="mx-auto max-w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">SkillExchange</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Discover people with the skills you want to learn.
          </p>
        </div>

        {/* Search bar constrained to max-w-2xl so it doesn't stretch too much */}
        <div className="relative mb-12 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for skills (e.g. React, Salesforce)..."
            className="h-14 pl-12 text-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
          />
          <Button className="absolute right-2 top-2 h-10 px-6" onClick={() => handleSearch(searchQuery)}>
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
                className="flex min-w-0 flex-col border-muted-foreground/10 transition-all duration-300 hover:shadow-2xl"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                      {user.fullName?.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="mb-1 truncate text-xl font-bold leading-tight">
                        {user.fullName}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-600">
                        <Star className="h-4 w-4 fill-current" /> 4.8
                        <span className="font-normal text-muted-foreground">(12 sessions)</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> San Francisco, CA
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col space-y-6 pt-0">
                  <div className="flex-1 space-y-4">
                    {/* Teaches Section */}
                    <div>
                      <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        <GraduationCap className="h-4 w-4" /> Can Teach
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsOffered?.map((s, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1 text-xs">
                            {s}
                          </Badge>
                        )) || <span className="text-xs text-muted-foreground">None</span>}
                      </div>
                    </div>

                    {/* Wants Section */}
                    <div>
                      <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        <BookOpen className="h-4 w-4" /> Wants to Learn
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {user.interests?.map((s, i) => (
                          <Badge key={i} variant="outline" className="px-3 py-1 text-xs">
                            {s}
                          </Badge>
                        )) || <span className="text-xs text-muted-foreground">None</span>}
                      </div>
                    </div>
                  </div>

                  <Button className="h-12 w-full text-md font-bold" onClick={() => setSelectedUser(user)}>
                    Request Exchange
                  </Button>
                </CardContent>
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