// @ts-nocheck
import { LocationSidebar } from "./utils/LocationSidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./components/ui/sidebar"
import MapBox from "./utils/MapBox";

function App() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-hidden">
        <LocationSidebar />
        <SidebarInset className="flex-1 bg-background overflow-auto">
          <div className="flex items-center gap-2 mb-4 md:hidden">
            <SidebarTrigger className="p-2" />
            <h2 className="text-lg font-semibold">Locations</h2>
          </div>
          <div className="flex items-center justify-center h-full">
            <MapBox />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default App
