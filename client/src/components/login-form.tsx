import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
import { GoogleLogin } from '@react-oauth/google';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {useNavigate} from "react-router-dom";
import { isAuthenticatedState, userInfo } from "@/atoms";
import { useRecoilState } from "recoil";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
  const [, setUserInfo ]= useRecoilState(userInfo);
  const navigate = useNavigate()
  const responseMessage = async (response: any) => {

    const resp = await fetch(`${baseUrl}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
      
    });
    const data = await resp.json();
    localStorage.setItem("token", data.token);
    setIsAuthenticated(true)
    setUserInfo({name: data.name, email: data.email})
    navigate("/dashboard")
  };
  const signUpResponseMessage = async (response: any) => {
    const resp = await fetch(`${baseUrl}/api/users/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    });
    const data = await resp.json();
    localStorage.setItem("token", data.token);
    setIsAuthenticated(true)
    setUserInfo({name: data.name, email: data.email})
    navigate("/dashboard")
  }
  const errorMessage = () => {
    console.log('Login Failed');
  };
 
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">

        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                    <GoogleLogin text="signup_with" onSuccess={signUpResponseMessage} onError={errorMessage} />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
