import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import { RootErrorBoundary } from "./RootErrorBoundary"
import NotFound from "../views/NotFound/NotFound"
import FindSkills from "@/views/FindSkills/FindSkills.tsx"
import Posts from "../users/post"
import CreateSession from "../users/CreateSession"
import Login from "../views/Auth/Login/Login.tsx"
import Signup from "../views/Auth/Signup/Signup.tsx"
import Private from "./Private"
import Public from "./Public"
import LandingPage from "@/views/LandingPage/LandingPage.tsx"
import Otp from "@/views/Auth/Otp/Otp.tsx"
import Chat from "@/views/Chat/Chat.tsx"
import EditProfile from "@/views/EditProfile/EditProfile.tsx"
import appRoutes from "./appRoutes.ts"
import Dashboard from "@/views/Dashboard/Dashboard.tsx"
import SkillexchangeRequests from "@/views/SkillExchangeRequests/SkillExchangeRequests.tsx"
import Profile from "@/views/Profile/Profile.tsx"
import Certifications from "@/views/Certifications/Certifications.tsx"
import SkillChallenges from "@/views/SkillChallenges/SkillChallenges.tsx"
import DashboardLayout from "./DashboardLayout"
import Settings from "@/views/Settings/Settings"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<RootErrorBoundary />}>
      {/* Public Routes */}
      <Route element={<Public />}>
        <Route path='/' element={<LandingPage />} />
        <Route path={appRoutes.login} element={<Login />} />
        <Route path={appRoutes.signup} element={<Signup />} />
        <Route path={appRoutes.otp} element={<Otp />} />
      </Route>

      {/* Private / Protected Routes */}
      <Route element={<Private />}>
        {/* Dashboard-style pages that share a persistent sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path={appRoutes.dashboard} element={<Dashboard />} />
          <Route path={appRoutes.editProfile} element={<EditProfile />} />
          <Route path={appRoutes.findSkills} element={<FindSkills />} />
          <Route path={appRoutes.userProfile} element={<Profile />} />
          <Route path={appRoutes.certifications} element={<Certifications />} />
          <Route path={appRoutes.skillChallenges} element={<SkillChallenges />} />
          <Route
            path={appRoutes.skillExchangeRequests}
            element={<SkillexchangeRequests />}
          />
           <Route path={appRoutes.chats} element={<Chat />} />
          <Route path={appRoutes.settings} element={<Settings />} />
        </Route>

        {/* Standalone private routes that manage their own layout */}
        <Route path={appRoutes.posts} element={<Posts />} />
        <Route path={appRoutes.createSession} element={<CreateSession />} />
      </Route>

      {/* Not Found Page */}
      <Route path='*' element={<NotFound />} />
    </Route>,
  ),
);

export default router;
