
import React from 'react';
import NavBar from '../components/NavBar';
import FilterSidebar from '../components/FilterSidebar';
import LocationList from '../components/LocationList';
import { AppProvider } from '../context/AppContext';
import { useIsMobile } from '../hooks/use-mobile';

const Locations = () => {
  const isMobile = useIsMobile();

  return (
    <AppProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <NavBar />
        
        <main className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className={`${isMobile ? 'hidden' : 'w-80'} border-r bg-gray-50 p-4 overflow-y-auto`}>
            <FilterSidebar />
          </aside>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isMobile && (
              <div className="mb-4">
                <FilterSidebar />
              </div>
            )}
            <LocationList />
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default Locations;
