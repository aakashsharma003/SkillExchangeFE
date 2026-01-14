import { useEffect, useState } from "react"

import { fetchUserProfile } from "@/api/user"
import Badges from "@/components/Dashboard/Badges"
import ProfileHeader from "@/components/Dashboard/ProfileHeader"
import SkillsOffered from "@/components/Dashboard/SkillsOffered"
import SessionHistory from "@/components/Dashboard/SessionHistory"
import UserReviews from "@/components/Dashboard/UserReviews"
import ProgressTracker from "@/components/Dashboard/ProgressTracker"
import appRoutes from "@/routes/appRoutes"
import { User } from "@/types/user"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"

export default function Profile() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state as string | undefined

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User>()

  useEffect(() => {
    if (!email) {
      toast.error("Unable to open profile. User information is missing.")
      navigate(appRoutes.dashboard, { replace: true })
      return
    }

    ;(async () => {
      try {
        setLoading(true)

        const res = await fetchUserProfile(email)

        if (!res.success) {
          setLoading(false)
          return toast.error(res.message)
        }
        setUser(res.data)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.error(err)
        toast.error("Something went wrong while loading profile.")
      }
    })()
  }, [email, navigate])

  return (
    <div className="space-y-8 p-8">
      {loading || !user ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mx-auto my-2 h-24 w-24 animate-spin" />
        </div>
      ) : (
        <>
          <ProfileHeader user={user} />

          <Badges />

          <SkillsOffered skills={user.skillsOffered} />

          <ProgressTracker learningProgress={user.learningProgress ?? {}} />

          <UserReviews />

          <SessionHistory />
        </>
      )}
    </div>
  )
}
