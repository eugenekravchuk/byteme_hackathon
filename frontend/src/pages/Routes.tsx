
import React from 'react';
import NavBar from '../components/NavBar';
import { AppProvider } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { MapPin, Route, Accessibility, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const Routes = () => {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-1 container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <Route className="mr-2 h-6 w-6" />
            Accessible Routes
          </h1>
          
          <div className="mb-10">
            <Card className="bg-accessible/10 border-accessible/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-accessible" />
                  Coming Soon
                </CardTitle>
                <CardDescription>
                  Route planning will be available in the next version.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>In the upcoming release, you'll be able to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Plan routes between accessible locations</li>
                  <li>Filter routes based on specific accessibility needs</li>
                  <li>Receive step-by-step navigation guidance</li>
                  <li>Save your favorite routes for quick access</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button disabled>Be notified when available</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>Frequently used accessible pathways</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <Accessibility className="h-5 w-5 text-accessible mr-2" />
                    <h3 className="font-medium">City Center Loop</h3>
                  </div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
                      <span>Starts at Central Library</span>
                    </div>
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
                      <span>Ends at City Park</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" disabled>View Route</Button>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <Accessibility className="h-5 w-5 text-accessible mr-2" />
                    <h3 className="font-medium">Museum District</h3>
                  </div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
                      <span>Starts at Art Museum</span>
                    </div>
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
                      <span>Ends at Star Cinema</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" disabled>View Route</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>My Routes</CardTitle>
                <CardDescription>Your saved accessible routes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center text-muted-foreground">
                  <p>You haven't saved any routes yet.</p>
                </div>
                <Button className="w-full mt-4" disabled>Create New Route</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Filters</CardTitle>
                <CardDescription>Customize routes based on your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="filter-wheelchair"
                      className="h-4 w-4 text-accessible border-gray-300 focus:ring-accessible2"
                      disabled
                    />
                    <label htmlFor="filter-wheelchair" className="text-sm font-normal">
                      Wheelchair accessible only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="filter-restrooms"
                      className="h-4 w-4 text-accessible border-gray-300 focus:ring-accessible2"
                      disabled
                    />
                    <label htmlFor="filter-restrooms" className="text-sm font-normal">
                      Routes with accessible restrooms
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="filter-vision"
                      className="h-4 w-4 text-accessible border-gray-300 focus:ring-accessible2"
                      disabled
                    />
                    <label htmlFor="filter-vision" className="text-sm font-normal">
                      Visual impairment friendly
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="filter-parking"
                      className="h-4 w-4 text-accessible border-gray-300 focus:ring-accessible2"
                      disabled
                    />
                    <label htmlFor="filter-parking" className="text-sm font-normal">
                      With accessible parking
                    </label>
                  </div>
                </div>
                <Button className="w-full mt-4" disabled>Apply Filters</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default Routes;
