// components/AdminSidebar.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap,
  Globe,
  Settings,
  Layers,
  MessageCircle,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Courses", icon: BookOpen, path: "/admin/courses" },
    { name: "Teachers", icon: Users, path: "/admin/teachers" },
    { name: "Students", icon: GraduationCap, path: "/admin/students" },
    { name: "Countries", icon: Globe, path: "/admin/countries" },
    { name: "Stages", icon: Layers, path: "/admin/stages" },
    { name: "Chat", icon: MessageCircle, path: "/admin/chat" },
    { name: "Withdraw money", icon: CreditCard, path: "/admin/withdraw" },
    { name: "Settings", icon: Settings, path: "/admin/settings" }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className={`bg-white shadow-lg h-screen sticky top-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {isOpen && <h2 className="text-xl font-bold text-gray-800">Admin</h2>}
        <button 
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={index}>
                <button 
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    active 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "hover:bg-blue-50 hover:text-blue-600 text-gray-700"
                  } ${!isOpen ? 'justify-center' : ''}`}
                  title={!isOpen ? item.name : ''}
                >
                  <IconComponent size={20} />
                  {isOpen && <span className="font-medium">{item.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;