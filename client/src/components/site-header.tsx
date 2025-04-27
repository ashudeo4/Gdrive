import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {useNavigate} from "react-router-dom";
import { isAuthenticatedState } from "@/atoms";
import { useRecoilState } from "recoil";

export function SiteHeader() {
  const navigate = useNavigate()
  const [, setIsAuthenticated] = useRecoilState(isAuthenticatedState);

  const logOut = () =>{
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    navigate('/login')
  }
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={logOut}>
              LogOut
          </Button>
        </div>
      </div>
    </header>
  )
}
