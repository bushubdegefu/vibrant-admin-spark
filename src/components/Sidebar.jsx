
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Users', path: '/users', icon: Users },
  { title: 'Groups', path: '/groups', icon: ShieldCheck },
  { title: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, isMobile } = useSidebar();
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 z-30 w-64 glass transition-transform duration-300 ease-spring border-r border-border",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:z-0"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
  
          
          {/* Sidebar navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "sidebar-item",
                  isActive ? "active" : ""
                )}
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Toggle button for non-mobile */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed bottom-6 left-6 z-50 p-2 rounded-full shadow-lg glass hidden md:flex items-center justify-center",
          isSidebarOpen ? "left-[17rem]" : "left-6"
        )}
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </>
  );
};

export default Sidebar;
