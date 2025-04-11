
import React from 'react';
import { AppProvider } from '../context/AppContext';
import NavBar from '../components/NavBar';
import FilterSidebar from '../components/FilterSidebar';
import MapView from '../components/MapView';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <NavBar />
        
        <main className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className={`${isMobile ? 'w-full' : 'w-80'} border-r bg-gray-50 p-4 overflow-y-auto`}>
            <FilterSidebar />
          </aside>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <MapView />
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
