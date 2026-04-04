import { lazy, Suspense } from "react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import { RootErrorBoundary } from "./RootErrorBoundary"
import Private from "./Private"
import Public from "./Public"
import DashboardLayout from "./DashboardLayout"
import appRoutes from "./appRoutes.ts"

/* ── Lazy-loaded pages (code-split per route) ── */
const LandingPage = lazy(() => import("@/views/LandingPage/LandingPage"))
const Login = lazy(() => import("@/views/Auth/Login/Login"))
const Signup = lazy(() => import("@/views/Auth/Signup/Signup"))
const Otp = lazy(() => import("@/views/Auth/Otp/Otp"))
const Dashboard = lazy(() => import("@/views/Dashboard/Dashboard"))
const EditProfile = lazy(() => import("@/views/EditProfile/EditProfile"))
const FindSkills = lazy(() => import("@/views/FindSkills/FindSkills"))
const Profile = lazy(() => import("@/views/Profile/Profile"))
const Certifications = null // Removed
const Chat = lazy(() => import("@/views/Chat/Chat"))
const Settings = lazy(() => import("@/views/Settings/Settings"))
const Notifications = lazy(() => import("@/views/Notifications/Notifications"))
const Calendar = lazy(() => import("@/views/Calendar/Calendar"))
const Posts = lazy(() => import("../users/post"))
const CreateSession = lazy(() => import("../users/CreateSession"))
const NotFound = lazy(() => import("../views/NotFound/NotFound"))

/* ── Minimal loading indicator ── */
function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<RootErrorBoundary />}>
      {/* Public Routes */}
      <Route element={<Public />}>
        <Route path='/' element={<Suspense fallback={<Loader />}><LandingPage /></Suspense>} />
        <Route path={appRoutes.login} element={<Suspense fallback={<Loader />}><Login /></Suspense>} />
        <Route path={appRoutes.signup} element={<Suspense fallback={<Loader />}><Signup /></Suspense>} />
        <Route path={appRoutes.otp} element={<Suspense fallback={<Loader />}><Otp /></Suspense>} />
      </Route>

      {/* Private / Protected Routes */}
      <Route element={<Private />}>
        {/* Dashboard-style pages that share a persistent sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path={appRoutes.dashboard} element={<Suspense fallback={<Loader />}><Dashboard /></Suspense>} />
          <Route path={appRoutes.editProfile} element={<Suspense fallback={<Loader />}><EditProfile /></Suspense>} />
          <Route path={appRoutes.findSkills} element={<Suspense fallback={<Loader />}><FindSkills /></Suspense>} />
          <Route path={appRoutes.userProfile} element={<Suspense fallback={<Loader />}><Profile /></Suspense>} />

          <Route path={appRoutes.chats} element={<Suspense fallback={<Loader />}><Chat /></Suspense>} />
          <Route path={appRoutes.settings} element={<Suspense fallback={<Loader />}><Settings /></Suspense>} />
          <Route path={appRoutes.notifications} element={<Suspense fallback={<Loader />}><Notifications /></Suspense>} />
          <Route path={appRoutes.calendar} element={<Suspense fallback={<Loader />}><Calendar /></Suspense>} />
        </Route>

        {/* Standalone private routes that manage their own layout */}
        <Route path={appRoutes.posts} element={<Suspense fallback={<Loader />}><Posts /></Suspense>} />
        <Route path={appRoutes.createSession} element={<Suspense fallback={<Loader />}><CreateSession /></Suspense>} />
      </Route>

      {/* Not Found Page */}
      <Route path='*' element={<Suspense fallback={<Loader />}><NotFound /></Suspense>} />
    </Route>,
  ),
);

export default router;
