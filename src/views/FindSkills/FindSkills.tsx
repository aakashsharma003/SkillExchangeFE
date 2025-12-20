import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { searchUser } from '@/api/user';
import { User } from '@/types/user';
import Sidebar from '@/components/Dashboard/SideBar'; 
import RequestSkillExchange from './RequestSkillExchange';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Loader2, BookOpen, GraduationCap } from "lucide-react";

const FindSkills = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const handleSearch = async (skill: string) => {
    setLoading(true);
    try {
      const res = await searchUser(skill);
      setUsers(res.data);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleSearch(''); }, []);

  return (
    <div className="flex min-h-screen bg-background w-full overflow-x-hidden">
      
      {/* Sidebar: Fixed width to match the margin */}
      <div className="fixed inset-y-0 left-0 z-50 hidden md:block w-64 border-r bg-white">
        <Sidebar onNavigate={(href) => navigate(href)} />
      </div>

      {/* Main: Fixed Gap by using exact ml-64 and w-full */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 w-full">
        <div className="max-w-full mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">SkillExchange</h1>
            <p className="text-muted-foreground mt-2 text-lg">Discover people with the skills you want to learn.</p>
          </div>

          {/* Search bar constrained to max-w-2xl so it doesn't stretch too much */}
          <div className="relative mb-12 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for skills (e.g. React, Salesforce)..."
              className="pl-12 h-14 text-lg shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            />
            <Button 
                className="absolute right-2 top-2 h-10 px-6" 
                onClick={() => handleSearch(searchQuery)}
            >
                Search
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
          ) : (
            /* Grid layout: Ensure it fills the width */
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 w-full">
              {users.map((user) => (
                <Card key={user.id} className="flex flex-col min-w-0 border-muted-foreground/10 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary shrink-0">
                        {user.fullName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Truncate used here to stop overflow */}
                        <CardTitle className="text-xl font-bold truncate leading-tight mb-1">{user.fullName}</CardTitle>
                        <div className="flex items-center gap-1.5 text-sm text-yellow-600 font-bold">
                          <Star className="h-4 w-4 fill-current" /> 4.8 
                          <span className="text-muted-foreground font-normal">(12 sessions)</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> San Francisco, CA
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 flex-1 flex flex-col pt-0">
                    <div className="space-y-4 flex-1">
                      {/* Teaches Section */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4" /> Teaches
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {/* FIX: Using 'skills' instead of 'skillsOffered' based on your image_f0a6c2 error */}
                          {user.skills?.map((s, i) => (
                            <Badge key={i} variant="secondary" className="px-3 py-1 text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Wants Section */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4" /> Wants to Learn
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {user.skills?.map((s, i) => (
                            <Badge key={i} variant="outline" className="px-3 py-1 text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full h-12 text-md font-bold" onClick={() => setSelectedUser(user)}>
                      Request Exchange
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedUser && (
        <RequestSkillExchange user={selectedUser} onClose={() => setSelectedUser(undefined)} />
      )}
    </div>
  );
};

export default FindSkills;