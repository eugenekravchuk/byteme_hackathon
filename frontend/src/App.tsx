
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Locations from "./pages/Locations";
import RoutesPage from "./pages/Routes";
import Profile from "./pages/Profile";
import MyReviews from "./pages/MyReviews";
import NotFound from "./pages/NotFound";
import LocationDetail from "./pages/LocationDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/map" element={<Index />} />
          <Route path="/" element={<Locations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/location/:id" element={<LocationDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
