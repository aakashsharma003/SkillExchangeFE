import Sidebar from "@/components/Dashboard/SideBar"
import DashboardPage from "@/components/Dashboard/Dashboard" // Alias hatane ki zaroorat nahi, direct use karein
import { useNavigate} from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate();

  const handleNavigate = (href: string) => {
    navigate(href);
    console.log(`Navigating to: ${href}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* 1. currentPath pass kar diya taaki active link highlight ho sake */}
      <Sidebar onNavigate={handleNavigate} />
      
      {/* 2. Main Content area ko scrollable banane ke liye flex-1 aur overflow-y-auto zaroori hai */}
      <main className="flex-1 overflow-y-auto">
         <DashboardPage />
      </main>
    </div>
  );
}

export default Dashboard;