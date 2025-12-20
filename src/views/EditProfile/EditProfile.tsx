import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "@/context/auth/useUser"
import Sidebar from "@/components/Dashboard/SideBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import Spinner from "@/components/ui/Spinner"
import { updateDetails } from "@/api/user"
import appRoutes from "@/routes/appRoutes"
import type { IUpdateUser } from "@/types/user"

export default function EditProfile() {
  const navigate = useNavigate()
  const {
    user: { email, ...rest },
    fetchUser,
  } = useUser()
  const [formData, setFormData] = useState<IUpdateUser>(rest)
  const [loading, setLoading] = useState(false)

  const setFormValue = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  const addSkill = (skill: string) => setFormData({ ...formData, skills: [...formData.skills, skill] })

  const removeSkill = (skill: string) =>
    setFormData({
      ...formData,
      skills: formData.skills.filter((val) => skill !== val),
    })

  const handleUpdate = async () => {
    if (formData.fullName === "" || formData.phone === "") return toast.error("Please fill in valid details")

    try {
      setLoading(true)
      const res = await updateDetails(formData)

      if (!res.success) {
        setLoading(false)
        return toast.error(res.message)
      }

      await fetchUser()
      setLoading(false)
      toast.success("Profile updated successfully!")
      navigate(appRoutes.dashboard)
    } catch (err) {
      setLoading(false)
      console.error("Error updating profile:", err)
      toast.error("something went wrong")
    }
  }

  const handleLogout = () => {
    // Handle logout
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {loading && <Spinner />}
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 lg:ml-64 ml-20 p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Edit Profile</h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">Update your profile information</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.fullName}
                  onChange={(e) => setFormValue("fullName", e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled placeholder="Your email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormValue("phone", e.target.value.replace(/\D/g, ""))}
                  placeholder="Your contact number"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio ?? ""}
                  onChange={(e) => setFormValue("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location ?? ""}
                  onChange={(e) => setFormValue("location", e.target.value)}
                  placeholder="Your location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedinLink ?? ""}
                  onChange={(e) => setFormValue("linkedinLink", e.target.value)}
                  placeholder="Your LinkedIn URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                 value={formData.githubLink ?? ""}
                  onChange={(e) => setFormValue("githubLink", e.target.value)}
                  placeholder="Your GitHub URL"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleUpdate} className="flex-1" disabled={loading}>
                  {loading ? "Updating..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => navigate(appRoutes.dashboard)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}




