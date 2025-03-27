
import { useState } from 'react';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { toggleSidebar, isMobile } = useSidebar();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-darker border-b border-border h-16 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isMobile && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-secondary"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="font-semibold text-lg">
          Django Admin
        </div>
      </div>
      
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-1.5 pl-9 pr-4 rounded-full bg-secondary/50 focus:bg-secondary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-secondary">
              <Bell size={18} />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center">
                3
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start py-2 cursor-pointer">
                  <div className="font-medium">New user registered</div>
                  <div className="text-sm text-muted-foreground">
                    User00{i} joined the platform
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {i} hour{i !== 1 ? 's' : ''} ago
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">A</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut size={16} className="mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
