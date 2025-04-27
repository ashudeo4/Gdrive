import { AppSidebar } from './app-sidebar'
import { SectionCards } from './section-cards'
import { SiteHeader } from './site-header'
import { SidebarProvider, SidebarInset } from './ui/sidebar'
import FileUpload from "./fileUpload"

function Dashboard() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col h-full">
                    <div className="@container/main flex flex-1 flex-col gap-2 h-full">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 flex-1">
                            <SectionCards />
                        </div>
                        <div className="mt-auto">
                            <FileUpload/>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Dashboard