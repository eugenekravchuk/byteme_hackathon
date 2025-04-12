import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  X, 
  MapPin, 
  User as UserIcon,
  LogIn, 
  LogOut,
  Accessibility
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import AuthModal from './AuthModal';
import { toast } from '../hooks/use-toast';

const NavBar = () => {
  const { user, setUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <>
      <nav className="bg-accessible shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Accessibility className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">AccessCompass</span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link to="/" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">
                Locations
              </Link>
              <Link to="/map" className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">
                Map
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-blue-100">
                      <UserIcon className="h-5 w-5 mr-2" />
                      {user.name}
                      {user.isSpecialAccess && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accessible2 text-white">
                          Special Access
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[9999]">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-reviews">My Reviews</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setAuthModalOpen(true)}
                  className="text-white border-white hover:bg-white hover:text-accessible"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-accessible2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/" 
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin className="inline-block h-5 w-5 mr-2" />
                Map
              </Link>
              <Link 
                to="/locations" 
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin className="inline-block h-5 w-5 mr-2" />
                Locations
              </Link>
              <Link 
                to="/routes" 
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin className="inline-block h-5 w-5 mr-2" />
                Routes
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserIcon className="inline-block h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                  >
                    <LogOut className="inline-block h-5 w-5 mr-2" />
                    Log out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                >
                  <LogIn className="inline-block h-5 w-5 mr-2" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default NavBar;
